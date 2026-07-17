// EXECUTORS — the only code that touches stock, money, or the outside world.
// Invariant: an executor runs only from `approved` (human tap or autonomy grant —
// see gate.ts). The approved→executing transition is the concurrency lock: if two
// callers race, one matches 0 rows and exits. Every step is audit-logged.
import { sql } from '@/lib/db';
import { emitAgentEvent } from '@/lib/sse';
import { getAction, transition, type ActionRow, type ActionType } from './machine';
import { acceptGraduation } from './trust';
import { sendWhatsApp } from '@/integrations/whatsapp';
import { renderPoPdf } from '@/integrations/po-pdf';
import { isTheme2ActionType } from '@/lib/theme2';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ── Domain action payload shape (set by domain-engine.ts) ───────────────────────
interface DomainActionPayload {
  domain: string;
  domain_name: string;
  title: string;
  owner: string;
  signal: string;
  draft: { format?: string; recipient?: string; body?: string };
  impact: { primary: string; secondary: string; costOfDelay: string };
  workflow_steps: string[];
  sources: string[];
  confidence: number;
  engine: { mode: string; runId: string };
}

// ── Private LLM helper (OpenRouter — same pattern as extractor.ts) ──────────────
async function callLLM(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return JSON.stringify({ error: 'no api key', mock: true });

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OTTO_URL ?? 'https://otto.app',
      'X-Title': 'Otto Agent',
    },
    body: JSON.stringify({
      model: process.env.MODEL_CHAT ?? 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  if (!res.ok) return JSON.stringify({ error: `LLM error ${res.status}`, mock: true });
  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '{}';
}

function safeParseJSON(text: string): Record<string, unknown> {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

/** Dispatch an approved action to its executor. Safe to call twice (lock above). */
export async function execute(actionId: string): Promise<void> {
  const action = await getAction(actionId);
  if (!action || action.status !== 'approved') return;

  const locked = await transition(actionId, 'approved', 'executing', {});
  if (!locked) return; // another caller won — clean no-op

  try {
    switch (locked.type) {
      case 'invoice_commit':      await executeInvoiceCommit(locked); break;
      case 'reorder':             await executeReorder(locked); break;
      case 'graduation_offer':    await executeGraduation(locked); break;
      case 'resurrection_commit': await executeResurrectionCommit(locked); break;
      default:
        if (
          isTheme2ActionType(locked.type) ||
          locked.type === 'admission_processing' ||
          locked.type === 'attendance_report'
        ) {
          await executeDomainAction(locked);
          break;
        }
        throw new Error(`no executor for type ${locked.type}`);
    }
    await transition(actionId, 'executing', 'executed', {
      detail: { auto: locked.approvedBy === 'autonomy_grant' },
    });
  } catch (err) {
    await transition(actionId, 'executing', 'failed', {
      detail: { error: err instanceof Error ? err.message : String(err) },
    });
    throw err;
  }
}

// ── Flow A: commit an extracted invoice ─────────────────────────────────────────
// purchase → stock IN + we owe supplier (credit) · sale → stock OUT + customer owes us (debit)
async function executeInvoiceCommit(action: ActionRow): Promise<void> {
  const p = action.payload as {
    doc_id: string;
    direction: 'purchase' | 'sale';
    counterparty: string;
    lines: { product_name: string; qty: number; unit_price: number; amount: number }[];
    total: number;
    invoice_no: string | null;
    invoice_date: string | null;
    due_date: string | null;
  };

  await sql.begin(async (tx) => {
    // resolve counterparty (name or alias match), create if new
    const table = p.direction === 'purchase' ? 'suppliers' : 'customers';
    let [party] = await tx.unsafe(
      `select id, name from ${table} where name ilike $1 or $1 ilike any(aliases) limit 1`,
      [p.counterparty],
    );
    if (!party) {
      [party] = await tx.unsafe(
        `insert into ${table} (name, source_doc_id) values ($1, $2) returning id, name`,
        [p.counterparty, p.doc_id],
      );
    }

    // stock mutations — unmatched lines are logged, never guessed
    const unmatched: string[] = [];
    for (const line of p.lines) {
      const delta = p.direction === 'purchase' ? line.qty : -line.qty;
      const updated = await tx`
        update products set stock_qty = stock_qty + ${delta}
        where name ilike ${line.product_name} or name ilike ${'%' + line.product_name + '%'}
        returning id, name, stock_qty`;
      if (updated.length === 0) unmatched.push(line.product_name);
    }

    if (p.direction === 'purchase') {
      await tx`insert into invoices (supplier_id, invoice_no, invoice_date, due_date, total, line_items, doc_id, status)
        values (${party!.id}, ${p.invoice_no}, ${p.invoice_date}, ${p.due_date}, ${p.total}, ${tx.json(p.lines)}, ${p.doc_id}, 'due')`;
      await tx`insert into ledger_entries (entity_type, entity_id, direction, amount, description, source_doc_id, action_id)
        values ('supplier', ${party!.id}, 'credit', ${p.total}, ${'Invoice ' + (p.invoice_no ?? '')}, ${p.doc_id}, ${action.id})`;
    } else {
      await tx`insert into ledger_entries (entity_type, entity_id, direction, amount, description, source_doc_id, action_id)
        values ('customer', ${party!.id}, 'debit', ${p.total}, ${'Credit sale ' + (p.invoice_no ?? '')}, ${p.doc_id}, ${action.id})`;
      await tx`update customers set dues_amount = dues_amount + ${p.total} where id = ${party!.id}`;
    }

    await tx`update documents set status = 'confirmed' where id = ${p.doc_id}`;

    await tx`insert into agent_events (action_id, from_state, to_state, detail)
      values (${action.id}, 'executing', 'executing', ${tx.json({
        step: 'side_effects_committed',
        direction: p.direction,
        counterparty: party!.name,
        lines: p.lines.length,
        unmatched,
      })})`;
  });

  // stock changed → Otto notices (event-driven trigger scan; dynamic import avoids cycle)
  const { scanReorderTriggers } = await import('./triggers');
  await scanReorderTriggers(action.orgId);
}

// ── Flow B: execute a reorder — PO PDF + WhatsApp to the supplier ───────────────
async function executeReorder(action: ActionRow): Promise<void> {
  const p = action.payload as {
    product_id: string; product_name: string;
    supplier_id: string; supplier_name: string; supplier_phone: string | null;
    qty: number; unit_cost: number;
  };

  const [{ n }] = (await sql`select count(*)::int as n from actions where type='reorder' and status in ('executing','executed','undone')`) as unknown as [{ n: number }];
  const poNumber = `PO-2026-${String(n + 1).padStart(4, '0')}`;
  const total = p.qty * p.unit_cost;

  const pdf = await renderPoPdf({
    poNumber,
    supplierName: p.supplier_name,
    supplierPhone: p.supplier_phone,
    lines: [{ productName: p.product_name, qty: p.qty, unitPrice: p.unit_cost, amount: total }],
    totalInr: total,
    issuedAt: new Date(),
  });
  mkdirSync('./data/pos', { recursive: true });
  writeFileSync(join('./data/pos', `${poNumber}.html`), pdf);

  const waBody =
    `Namaste ${p.supplier_name}! Purchase order ${poNumber} from Priya's Fashion:\n` +
    `${p.qty} × ${p.product_name} @ ₹${p.unit_cost} = ₹${total.toLocaleString('en-IN')}.\n` +
    `PO PDF attached. Please confirm dispatch date. — Otto (on behalf of Priya)`;
  const wa = await sendWhatsApp({
    to: `whatsapp:${p.supplier_phone ?? process.env.DEMO_SUPPLIER_WHATSAPP_TO ?? ''}`,
    body: waBody,
  });

  await sql`update actions set payload = payload || ${sql.json({ po_number: poNumber, pdf: `/api/po/${poNumber}`, wa_mode: wa.mode })} where id = ${action.id}`;
  await emitAgentEvent({
    actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'po_sent', po_number: poNumber, total, whatsapp: wa.mode, wa_body: waBody, pdf: `/api/po/${poNumber}` },
  });
}

// ── Theme 2: domain action dispatcher ───────────────────────────────────────────
async function executeDomainAction(action: ActionRow): Promise<void> {
  const p = action.payload as unknown as DomainActionPayload;
  try {
    switch (p.domain) {
      case 'hr':               return await executeDomainHR(action, p);
      case 'education':        return await executeDomainEducation(action, p);
      case 'healthcare':       return await executeDomainHealthcare(action, p);
      case 'legal':            return await executeDomainLegal(action, p);
      case 'manufacturing':    return await executeDomainManufacturing(action, p);
      case 'sales':            return await executeDomainSales(action, p);
      case 'customer_support': return await executeDomainSupport(action, p);
      case 'retail':           return await executeDomainRetail(action, p);
      default:
        await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
          detail: { step: 'domain_fallback', domain: p.domain } });
    }
  } catch (err) {
    await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
      detail: { step: 'domain_executor_error', domain: p.domain,
        error: err instanceof Error ? err.message : String(err) } });
  }
}

// ── HR: onboarding checklist ────────────────────────────────────────────────────
async function executeDomainHR(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `New hire context:\n${p.draft.body ?? p.signal}\n\nOwner: ${p.owner}`,
    'You are an HR onboarding specialist. Generate a JSON onboarding checklist with the structure: { "tasks": [{ "dept": string, "task": string, "deadline_days": number }] }. Include IT provisioning, policy acknowledgement, welcome email, and payroll setup. Return ONLY valid JSON.',
  );
  const parsed = safeParseJSON(raw);
  const tasks = (parsed.tasks as unknown[]) ?? [parsed];

  await sql`insert into generated_documents (type, recipient_name, status, content_ref)
    values ('admission_letter', ${p.owner ?? 'HR Manager'}, 'ready', ${JSON.stringify(tasks)})`;
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'onboarding_plan_generated', tasks } });
}

// ── Education: admission decision letter ────────────────────────────────────────
async function executeDomainEducation(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const letter = await callLLM(
    `Draft context:\n${p.draft.body ?? p.signal}`,
    'You are a school admissions officer. Write a complete, formal admission decision letter. Include congratulations, next steps, fee schedule reference, and orientation date. Output plain text only, no JSON.',
  );

  await sql`insert into generated_documents (type, recipient_name, status, content_ref)
    values ('admission_letter', ${'Admission Applicant'}, 'ready', ${letter})`;
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'admission_letter_generated', char_count: letter.length } });
}

// ── Healthcare: triage follow-up queue ──────────────────────────────────────────
async function executeDomainHealthcare(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `Follow-up signal:\n${p.signal}\n\nDraft: ${p.draft.body ?? ''}`,
    'You are a clinic operations assistant. Classify 3 sample follow-ups into one of: schedule_appointment, report_pickup, payment_reminder, clinical_review. Output JSON: { "followups": [{ "type": string, "priority": "high"|"medium"|"low", "draft_message": string }] }. Return ONLY valid JSON.',
  );
  const parsed = safeParseJSON(raw);
  const followups = (parsed.followups as unknown[]) ?? [];
  const breakdown: Record<string, number> = {};
  for (const f of followups) {
    const t = (f as Record<string, string>).type ?? 'unknown';
    breakdown[t] = (breakdown[t] ?? 0) + 1;
  }
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'followup_queue_triaged', total: followups.length, breakdown } });
}

// ── Legal: contract risk memo ───────────────────────────────────────────────────
async function executeDomainLegal(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `Contract context:\n${p.draft.body ?? p.signal}`,
    'You are a legal risk analyst. Generate a contract risk memo as JSON: { "risk_level": "low"|"medium"|"high", "clauses_flagged": [string], "recommendation": string }. Return ONLY valid JSON.',
  );
  const memo = safeParseJSON(raw);
  const clauses = Array.isArray(memo.clauses_flagged) ? memo.clauses_flagged : [];

  await sql`insert into generated_documents (type, recipient_name, status, content_ref)
    values ('admission_letter', ${'Legal team'}, 'ready', ${JSON.stringify(memo)})`;
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'contract_risk_memo_generated', risk_level: memo.risk_level ?? 'unknown', clauses: clauses.length } });
}

// ── Manufacturing: maintenance work order ───────────────────────────────────────
async function executeDomainManufacturing(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `IoT anomaly data:\n${p.signal}\n\nContext: ${p.draft.body ?? ''}`,
    'You are a manufacturing maintenance planner. Generate a work order as JSON: { "equipment": string, "severity": "critical"|"high"|"medium"|"low", "actions": [string], "parts_needed": [string], "estimated_downtime_hours": number }. Return ONLY valid JSON.',
  );
  const order = safeParseJSON(raw);
  const actions = Array.isArray(order.actions) ? order.actions : [];
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'maintenance_order_created', severity: order.severity ?? 'unknown', actions: actions.length } });
}

// ── Sales: outreach plan ────────────────────────────────────────────────────────
async function executeDomainSales(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `Sales signal:\n${p.signal}\n\nDraft: ${p.draft.body ?? ''}`,
    'You are a sales strategist. Generate a 3-account outreach plan as JSON: { "accounts": [{ "name": string, "signal": string, "opening_line": string, "follow_up_timing": string }] }. Return ONLY valid JSON.',
  );
  const parsed = safeParseJSON(raw);
  const accounts = Array.isArray(parsed.accounts) ? parsed.accounts : [];
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'outreach_plan_generated', accounts: accounts.length } });
}

// ── Customer Support: draft support response ────────────────────────────────────
async function executeDomainSupport(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const response = await callLLM(
    `Customer query:\n${p.draft.body ?? p.signal}`,
    'You are a customer support specialist. Write a complete, empathetic support response addressing the query. Include next steps and relevant policy information. Output plain text only, no JSON.',
  );

  await sql`insert into generated_documents (type, recipient_name, status, content_ref)
    values ('admission_letter', ${'Customer'}, 'ready', ${response})`;
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'support_response_drafted', char_count: response.length } });
}

// ── Retail: campaign brief ──────────────────────────────────────────────────────
async function executeDomainRetail(action: ActionRow, p: DomainActionPayload): Promise<void> {
  const raw = await callLLM(
    `Retail signal:\n${p.signal}\n\nDraft: ${p.draft.body ?? ''}`,
    'You are a retail marketing strategist. Generate a campaign brief as JSON: { "campaign_name": string, "target_segment": string, "offer": string, "channels": [string], "expected_uplift_pct": number }. Return ONLY valid JSON.',
  );
  const brief = safeParseJSON(raw);
  await emitAgentEvent({ actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'campaign_brief_generated', campaign: brief.campaign_name ?? 'untitled' } });
}

// ── Graduation: owner tapped "Earn it, Otto" ────────────────────────────────────
async function executeGraduation(action: ActionRow): Promise<void> {
  const p = action.payload as { action_type: ActionType; cap: number };
  await acceptGraduation(action.orgId, p.action_type, p.cap);
  await emitAgentEvent({
    actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: { step: 'autonomy_granted', action_type: p.action_type, cap: p.cap },
  });
}

// ── Flow 0: commit the staged resurrected business (nothing was live until now) ──
async function executeResurrectionCommit(action: ActionRow): Promise<void> {
  const staged = (action.payload as { staged: StagedBusiness }).staged;

  await sql.begin(async (tx) => {
    const supplierIds = new Map<string, string>();
    for (const s of staged.suppliers) {
      const [row] = await tx`insert into suppliers (name, phone, aliases, source_doc_id, confidence)
        values (${s.name}, ${s.phone}, ${s.aliases}, ${s.source_doc_id}, ${s.confidence}) returning id`;
      supplierIds.set(s.name, row!.id as string);
    }
    const customerIds = new Map<string, string>();
    for (const c of staged.customers) {
      const [row] = await tx`insert into customers (name, phone, aliases, dues_amount, source_doc_id, confidence)
        values (${c.name}, ${c.phone}, ${c.aliases}, ${c.dues_amount}, ${c.source_doc_id}, ${c.confidence}) returning id`;
      customerIds.set(c.name, row!.id as string);
    }
    for (const pr of staged.products) {
      await tx`insert into products (name, unit_price, stock_qty, reorder_point, reorder_qty, supplier_id, price_history, source_doc_id, confidence)
        values (${pr.name}, ${pr.unit_price}, ${pr.stock_qty}, ${pr.reorder_point}, ${pr.reorder_qty},
                ${pr.supplier_name ? supplierIds.get(pr.supplier_name) ?? null : null},
                ${tx.json(pr.price_history)}, ${pr.source_doc_id}, ${pr.confidence})`;
    }
    for (const l of staged.ledger) {
      const id = l.entity_type === 'customer' ? customerIds.get(l.entity_name) : supplierIds.get(l.entity_name);
      if (!id) continue;
      await tx`insert into ledger_entries (entity_type, entity_id, direction, amount, description, source_doc_id)
        values (${l.entity_type}, ${id}, ${l.direction}, ${l.amount}, ${l.description}, ${l.source_doc_id})`;
    }
    await tx`update documents set status = 'confirmed' where status = 'extracted'`;
  });

  await emitAgentEvent({
    actionId: action.id, fromState: 'executing', toState: 'executing',
    detail: {
      step: 'business_live',
      products: staged.products.length, suppliers: staged.suppliers.length,
      customers: staged.customers.length,
    },
  });
  // deliberately NO trigger scan here: low-stock findings are narrated during
  // resurrection; reorder agents wake on the next real stock event (demo pacing).
}

export interface StagedBusiness {
  suppliers: { name: string; phone: string | null; aliases: string[]; source_doc_id: string | null; confidence: number }[];
  customers: { name: string; phone: string | null; aliases: string[]; dues_amount: number; source_doc_id: string | null; confidence: number }[];
  products: {
    name: string; unit_price: number | null; stock_qty: number; reorder_point: number | null;
    reorder_qty: number | null; supplier_name: string | null;
    price_history: { date: string | null; price: number; doc_id: string | null }[];
    source_doc_id: string | null; confidence: number;
  }[];
  ledger: { entity_type: 'customer' | 'supplier'; entity_name: string; direction: 'debit' | 'credit'; amount: number; description: string; source_doc_id: string | null }[];
}

// ── Undo (auto-executed reorders, within the 1-hour window) ─────────────────────
export async function undoAction(actionId: string): Promise<{ ok: boolean; reason?: string }> {
  const action = await getAction(actionId);
  if (!action || action.status !== 'executed') {
    return { ok: false, reason: 'not an executed action' };
  }
  if (!action.undoDeadline || new Date() > new Date(action.undoDeadline)) {
    return { ok: false, reason: 'undo window elapsed' };
  }

  if (
    isTheme2ActionType(action.type) ||
    action.type === 'admission_processing' ||
    action.type === 'attendance_report'
  ) {
    const ok = await transition(actionId, 'executed', 'undone', {
      payloadMerge: {
        domain_status: 'reversed',
        reversed_at: new Date().toISOString(),
      },
      detail: {
        step: 'domain_action_reversed',
        note: 'Connector-ready packet withdrawn before external execution.',
      },
    });
    return { ok: !!ok };
  }

  if (action.type !== 'reorder') {
    return { ok: false, reason: `undo not supported for ${action.type}` };
  }

  const ok = await transition(actionId, 'executed', 'undone', {
    payloadMerge: { po_cancelled: true },
    detail: { step: 'po_cancelled', note: 'compensating action: PO withdrawn, supplier notified' },
  });
  if (ok) {
    const p = action.payload as { supplier_name?: string; po_number?: string; supplier_phone?: string };
    await sendWhatsApp({
      to: `whatsapp:${p.supplier_phone ?? ''}`,
      body: `Please ignore purchase order ${p.po_number} — it has been cancelled. Apologies! — Otto`,
    });
  }
  return { ok: !!ok };
}
