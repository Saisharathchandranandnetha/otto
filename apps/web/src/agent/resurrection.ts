// FLOW 0 — THE RESURRECTION PIPELINE.
// batch extract → entity resolution → inference pass → narrated build (SSE) →
// ONE summary card. Entities are STAGED in the action payload: nothing goes live
// until the owner taps "This is my business ✅" (resurrection_commit executor).
import { readFileSync } from 'node:fs';
import { sql } from '@/lib/db';
import { emitAgentEvent } from '@/lib/sse';
import { extract } from '@/extract/extractor';
import {
  InvoiceExtraction, LedgerPageExtraction, WhatsAppExtraction, EntityResolutionResult,
  type AnyExtraction, fieldConfidences, CONFIDENCE_REVIEW_THRESHOLD,
} from '@/extract/schemas';
import { createAction, draftAction, transition } from './machine';
import { inferProduct, inferDues, inventoryInsights, financialInsights, type PurchaseEvent, type LedgerLine, type BusinessInsight } from './inference';
import type { StagedBusiness } from './executors';

export interface ResurrectionSummary {
  actionId: string;
  products: number; suppliers: number; customers: number;
  totalDuesInr: number; belowReorderPoint: number; lowConfidenceCount: number;
  docsProcessed: number; docsFailed: number;
  insights?: BusinessInsight[];
}

const narrate = (line: string, extra: Record<string, unknown> = {}) =>
  emitAgentEvent({ actionId: null, fromState: null, toState: 'narration', detail: { line, ...extra } });

export async function runResurrection(documentIds: string[]): Promise<ResurrectionSummary> {
  const action = await createAction({
    type: 'resurrection_commit',
    reasoning: 'Rebuilding this business from its paper trail. Nothing goes live until you confirm.',
  });

  await narrate(`Reading ${documentIds.length} documents from the shoebox…`);

  // ── 1. batch extraction queue (per-doc cache; failures logged, never fatal) ────
  const extractions: { docId: string; fileName: string; data: AnyExtraction }[] = [];
  let failed = 0;

  for (const docId of documentIds) {
    const [doc] = await sql`update documents set status = 'extracting' where id = ${docId}
                            returning id, kind, file_name, storage_path`;
    if (!doc) continue;
    try {
      const isText = doc.kind === 'whatsapp_export';
      const body = readFileSync(doc.storagePath as string);
      const schema =
        doc.kind === 'invoice' ? InvoiceExtraction :
        doc.kind === 'ledger_page' ? LedgerPageExtraction : WhatsAppExtraction;

      const { data } = await extract(
        {
          task: doc.kind as 'invoice' | 'ledger_page' | 'whatsapp_export',
          ...(isText ? { text: body.toString('utf8') } : { image: body }),
          hint: doc.fileName as string,
        },
        schema,
      );

      await sql`update documents set status = 'extracted',
        extraction = ${sql.json(data as any)},
        field_confidence = ${sql.json(fieldConfidences(data) as any)}
        where id = ${docId}`;
      extractions.push({ docId, fileName: doc.fileName as string, data });

      if (data.doc_type === 'invoice') {
        await narrate(`📄 ${data.counterparty_name.value} invoice — ${data.line_items.length} items, ₹${data.total.value.toLocaleString('en-IN')}`, { doc: doc.fileName });
      } else if (data.doc_type === 'ledger_page') {
        await narrate(`📒 Ledger page — ${data.rows.length} entries${data.page_label.value ? ` (${data.page_label.value})` : ''}`, { doc: doc.fileName });
      } else {
        await narrate(`💬 WhatsApp history — ${data.contacts.length} contacts with business signals`, { doc: doc.fileName });
      }
    } catch (err) {
      failed++;
      await sql`update documents set status = 'failed', error = ${err instanceof Error ? err.message : String(err)} where id = ${docId}`;
      await narrate(`⚠️ Couldn't read ${doc.fileName} — set aside for you to retake`, { doc: doc.fileName });
    }
  }

  // ── 2. entity resolution: one pass over every name seen anywhere ───────────────
  await narrate('Cross-checking names across documents…');
  const seen: { name: string; type: string; phone: string | null; source: string }[] = [];
  for (const e of extractions) {
    if (e.data.doc_type === 'invoice') {
      seen.push({ name: e.data.counterparty_name.value, type: e.data.direction.value === 'purchase' ? 'supplier' : 'customer', phone: e.data.vendor_phone.value, source: e.fileName });
    } else if (e.data.doc_type === 'ledger_page') {
      for (const r of e.data.rows) seen.push({ name: r.party_name.value, type: 'customer', phone: null, source: e.fileName });
    } else {
      for (const c of e.data.contacts) seen.push({ name: c.name.value, type: c.role_guess.value, phone: c.phone.value, source: e.fileName });
    }
  }
  const { data: resolution } = await extract(
    { task: 'entity_resolution', text: JSON.stringify(seen, null, 2) },
    EntityResolutionResult,
  );
  const canonical = new Map<string, { name: string; phone: string | null; aliases: string[]; confidence: number }>();
  for (const m of resolution.merges) {
    for (const alias of [m.canonical_name, ...m.merged_aliases]) {
      canonical.set(alias.toLowerCase(), { name: m.canonical_name, phone: m.phone, aliases: m.merged_aliases, confidence: m.confidence });
    }
    if (m.merged_aliases.length > 0) {
      await narrate(`🔗 "${m.merged_aliases.join('" = "')}" = ${m.canonical_name}`, { evidence: m.evidence });
    }
  }
  const resolve = (name: string) => canonical.get(name.toLowerCase()) ?? { name, phone: null as string | null, aliases: [] as string[], confidence: 0.9 };

  // ── 3. inference pass (deterministic TS — see inference.ts) ────────────────────
  await narrate('Inferring stock levels, reorder points, and dues…');

  const purchasesByProduct = new Map<string, { events: PurchaseEvent[]; supplier: string | null }>();
  const ledgerLines: LedgerLine[] = [];
  const supplierSet = new Map<string, { phone: string | null; aliases: string[]; confidence: number; source: string | null }>();
  const customerSet = new Map<string, { phone: string | null; aliases: string[]; confidence: number; source: string | null }>();

  for (const e of extractions) {
    if (e.data.doc_type === 'invoice' && e.data.direction.value === 'purchase') {
      const sup = resolve(e.data.counterparty_name.value);
      supplierSet.set(sup.name, { phone: sup.phone, aliases: sup.aliases, confidence: Math.min(sup.confidence, e.data.counterparty_name.confidence), source: e.docId });
      for (const li of e.data.line_items) {
        const key = li.product_name.value;
        const cur = purchasesByProduct.get(key) ?? { events: [], supplier: sup.name };
        cur.events.push({ date: e.data.invoice_date.value, qty: li.qty.value, price: li.unit_price.value, doc_id: e.docId });
        purchasesByProduct.set(key, cur);
      }
    } else if (e.data.doc_type === 'ledger_page') {
      for (const r of e.data.rows) {
        const cust = resolve(r.party_name.value);
        customerSet.set(cust.name, { phone: cust.phone, aliases: cust.aliases, confidence: Math.min(cust.confidence, r.party_name.confidence), source: e.docId });
        ledgerLines.push({
          party: cust.name, debit: r.debit.value ?? 0, credit: r.credit.value ?? 0,
          description: r.description.value ?? 'ledger entry', date: r.date.value, doc_id: e.docId,
        });
      }
    } else if (e.data.doc_type === 'whatsapp_export') {
      for (const c of e.data.contacts) {
        const ent = resolve(c.name.value);
        const target = c.role_guess.value === 'supplier' ? supplierSet : customerSet;
        if (!target.has(ent.name)) target.set(ent.name, { phone: c.phone.value ?? ent.phone, aliases: ent.aliases, confidence: c.role_guess.confidence, source: e.docId });
        else if (c.phone.value) target.get(ent.name)!.phone ??= c.phone.value;
      }
    }
  }

  const products = [...purchasesByProduct.entries()].map(([name, v]) => inferProduct(name, v.events, v.supplier));
  const dues = inferDues(ledgerLines);

  // ── 4. stage everything on the action (uncommitted) + summary narration ────────
  const staged: StagedBusiness = {
    suppliers: [...supplierSet.entries()].map(([name, s]) => ({ name, phone: s.phone, aliases: s.aliases, source_doc_id: s.source, confidence: s.confidence })),
    customers: [...customerSet.entries()].map(([name, c]) => ({
      name, phone: c.phone, aliases: c.aliases,
      dues_amount: Math.max(0, dues.get(name)?.net ?? 0),
      source_doc_id: c.source, confidence: c.confidence,
    })),
    products: products.map((p) => ({
      name: p.name, unit_price: p.unit_price, stock_qty: p.stock_qty,
      reorder_point: p.reorder_point, reorder_qty: p.reorder_qty, supplier_name: p.supplier_name,
      price_history: p.purchases.map((e) => ({ date: e.date, price: e.price, doc_id: e.doc_id })),
      source_doc_id: p.purchases[0]?.doc_id ?? null, confidence: p.stock_confidence,
    })),
    ledger: ledgerLines.flatMap((l) => {
      const out: StagedBusiness['ledger'] = [];
      if (l.debit > 0) out.push({ entity_type: 'customer', entity_name: l.party, direction: 'debit', amount: l.debit, description: l.description, source_doc_id: l.doc_id });
      if (l.credit > 0) out.push({ entity_type: 'customer', entity_name: l.party, direction: 'credit', amount: l.credit, description: l.description, source_doc_id: l.doc_id });
      return out;
    }),
  };

  const totalDues = staged.customers.reduce((s, c) => s + c.dues_amount, 0);
  const belowReorder = products.filter((p) => p.stock_qty <= p.reorder_point).length;
  const lowConfidence = staged.products.filter((p) => p.confidence < CONFIDENCE_REVIEW_THRESHOLD).length;

  await narrate(`Found ${products.length} products, ${staged.suppliers.length} suppliers, ${staged.customers.length} customers`);
  for (const c of staged.customers.filter((c) => c.dues_amount > 0).sort((a, b) => b.dues_amount - a.dues_amount).slice(0, 3)) {
    await narrate(`💰 ${c.name} owes ₹${c.dues_amount.toLocaleString('en-IN')}`);
  }
  if (belowReorder > 0) await narrate(`📉 ${belowReorder} items look below safe stock — flagged`);
  if (lowConfidence > 0) await narrate(`🔍 ${lowConfidence} stock estimates need your review (marked in yellow)`);

  // ── THEME 7: Intelligence insights from the resurrected data ────────────────
  const allInvoices = extractions
    .filter((e) => e.data.doc_type === 'invoice')
    .map((e) => {
      const d = e.data as { direction?: { value: string }; total?: { value: number } };
      return { total: d.total?.value ?? 0, direction: d.direction?.value ?? 'purchase' };
    });
  const insights: BusinessInsight[] = [
    ...inventoryInsights(products),
    ...financialInsights(staged.suppliers, staged.customers, allInvoices),
  ];
  for (const ins of insights) {
    await narrate(`📊 ${ins.severity === 'high' ? '🔴' : ins.severity === 'medium' ? '🟡' : '🟢'} ${ins.summary}`, { insight: ins });
  }
  await narrate('🧠 Every number here is computed, not guessed — Otto turns analytics into action.');

  const summary: ResurrectionSummary = {
    actionId: action.id,
    products: products.length, suppliers: staged.suppliers.length, customers: staged.customers.length,
    totalDuesInr: totalDues, belowReorderPoint: belowReorder, lowConfidenceCount: lowConfidence,
    docsProcessed: extractions.length, docsFailed: failed,
    insights,
  };

  const insightLines = insights.map((i) => `[${i.label}] ${i.summary} → ${i.suggestion}`).join('\n');
  await draftAction(action.id, {
    reasoning: `Reconstructed from ${extractions.length} documents: ${products.length} products, ${staged.suppliers.length} suppliers, ${staged.customers.length} customers, ₹${totalDues.toLocaleString('en-IN')} in dues.\n\n${insights.length} data signals detected:\n${insightLines}`,
    detail: { summary: { ...summary } },
  });
  await sql`update actions set payload = ${sql.json({ staged, summary, insights } as any)} where id = ${action.id}`;
  await transition(action.id, 'drafted', 'awaiting_approval', { detail: { card: 'resurrection_summary' } });

  return summary;
}
