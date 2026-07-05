// Gate-verification runner: drives a full flow end-to-end against the running dev
// server (same endpoints the UI uses) and asserts the resulting DB state.
// A flow is "done" only when it passes 5× consecutively:
//   pnpm demo:reset && for i in 1 2 3 4 5; do pnpm flow A || break; done
// Usage: pnpm flow <0|A|B>   (expects `pnpm dev` on :3000 and EXTRACTOR_MODE=mock)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

const BASE = process.env.OTTO_URL ?? 'http://localhost:3000';
const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto', { max: 1 });

const die = (msg: string): never => { console.error(`✗ ${msg}`); process.exit(1); };
const ok = (msg: string) => console.log(`✓ ${msg}`);

async function upload(paths: string[], mode: 'single' | 'resurrection') {
  const form = new FormData();
  for (const p of paths) {
    const name = p.split('/').pop()!;
    const type = name.endsWith('.txt') ? 'text/plain' : 'image/svg+xml';
    form.append('files', new File([readFileSync(p)], name, { type }));
  }
  form.append('mode', mode);
  const res = await fetch(`${BASE}/api/ingest`, { method: 'POST', body: form });
  if (!res.ok) die(`ingest failed: ${await res.text()}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function approveLatest(type: string, capInr?: number): Promise<string> {
  const [a] = await sql`select id from actions where type = ${type} and status = 'awaiting_approval' order by created_at desc limit 1`;
  if (!a) die(`no awaiting ${type} action found`);
  const res = await fetch(`${BASE}/api/approve`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionId: a!.id, decision: 'approve', capInr }),
  });
  if (!res.ok) die(`approve ${type} failed: ${await res.text()}`);
  return a!.id as string;
}

async function expectStatus(actionId: string, status: string) {
  const [a] = await sql`select status from actions where id = ${actionId}`;
  if (a?.status !== status) die(`action ${actionId} is ${a?.status}, expected ${status}`);
}

async function flow0() {
  const dir = 'fixtures/shoebox';
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg') || f.endsWith('.txt')).map((f) => join(dir, f));
  const res = await upload(files, 'resurrection');
  const summary = res.summary as { products: number; suppliers: number; customers: number; actionId: string };
  ok(`resurrection ran: ${summary.products} products, ${summary.suppliers} suppliers, ${summary.customers} customers`);
  if (summary.products < 10) die(`expected >=10 products, got ${summary.products}`);
  if (summary.suppliers !== 2) die(`expected 2 suppliers after entity resolution, got ${summary.suppliers}`);
  if (summary.customers < 7) die(`expected >=7 customers, got ${summary.customers}`);

  const before = await sql`select count(*)::int as n from products`;
  if (before[0]!.n !== 0) die('entities went live BEFORE confirmation — approval gate breached!');
  ok('nothing live before the confirmation tap (gate holds)');

  const id = await approveLatest('resurrection_commit');
  await expectStatus(id, 'executed');
  const [prod] = await sql`select count(*)::int as n from products`;
  const [rahul] = await sql`select dues_amount from customers where name = 'Rahul Deep'`;
  if (prod!.n !== summary.products) die('committed product count mismatch');
  if (Number(rahul?.duesAmount) !== 8000) die(`Rahul's dues = ${rahul?.duesAmount}, expected 8000 (ledger arithmetic)`);
  ok(`business live: ${prod!.n} products committed, Rahul owes ₹8,000 ✓`);
}

async function flowA() {
  const [before] = await sql`select stock_qty from products where name ilike 'Kurti Set (Teal)'`;
  if (!before) die('run flow 0 first (or db:seed) — Kurti Set (Teal) missing');
  await upload(['fixtures/demo/sale-invoice.svg'], 'single');
  ok('sale invoice extracted → confirmation card');

  const id = await approveLatest('invoice_commit');
  await expectStatus(id, 'executed');
  const [after] = await sql`select stock_qty from products where name ilike 'Kurti Set (Teal)'`;
  if (Number(after!.stockQty) !== Number(before.stockQty) - 3) {
    die(`stock ${before.stockQty} → ${after!.stockQty}, expected −3`);
  }
  const [ledger] = await sql`select count(*)::int as n from ledger_entries where action_id = ${id}`;
  if (ledger!.n < 1) die('no ledger entry written');
  ok(`stock ${before.stockQty} → ${after!.stockQty}, ledger written, trace logged`);
}

async function flowB() {
  // Flow A left Kurti Set (Teal) at/below reorder point → a reorder card should exist
  const [draft] = await sql`select id, amount from actions where type='reorder' and status='awaiting_approval' order by created_at desc limit 1`;
  if (!draft) die('no reorder card awaiting — did Flow A run after demo:reset?');
  ok(`Otto noticed: reorder draft ₹${Number(draft.amount).toLocaleString('en-IN')} awaiting approval`);

  const reorderId = await approveLatest('reorder'); // 3rd human approval (2 pre-seeded)
  await expectStatus(reorderId, 'executed');
  ok('reorder executed: PO PDF + WhatsApp (check ./data/pos)');

  const [offer] = await sql`select id from actions where type='graduation_offer' and status='awaiting_approval'`;
  if (!offer) die('graduation card did not appear after 3rd approval');
  ok('🎓 graduation card surfaced');
  await approveLatest('graduation_offer', 10000);
  const [grant] = await sql`select autonomy_level, amount_cap from trust_grants where action_type='reorder'`;
  if (grant?.autonomyLevel !== 'autonomous') die('trust grant not autonomous after acceptance');
  ok(`autonomy granted: reorders ≤ ₹${Number(grant.amountCap).toLocaleString('en-IN')}`);

  // 4th low-stock event → Otto executes ALONE
  // (resurrected tenant has no SKUs, so nudge stock directly — the on-stage demo
  //  uses the disclosed simulate_sale lever or a real second sale invoice)
  await sql`update products set stock_qty = reorder_point where name ilike 'Red Cotton Dupatta'`;
  const scan = await fetch(`${BASE}/api/agent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scan: 'reorder' }),
  }).then((r) => r.json() as Promise<{ autoExecuted: string[] }>);
  if (!scan.autoExecuted?.length) die('4th event was not auto-executed under the grant');
  const [auto] = await sql`select id, undo_deadline from actions where type='reorder' and approved_by='autonomy_grant' order by created_at desc limit 1`;
  if (!auto?.undoDeadline) die('auto-executed action missing undo window');
  ok(`Otto executed alone: ${scan.autoExecuted.join(', ')} — logged, notified, undoable until ${String(auto.undoDeadline).slice(11, 19)}`);

  // undo + revoke — reversible and revocable, proven
  const undo = await fetch(`${BASE}/api/approve`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionId: auto.id, decision: 'undo' }),
  });
  if (!undo.ok) die('undo failed inside the window');
  await fetch(`${BASE}/api/trust`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revoke: 'reorder' }),
  });
  const [after] = await sql`select autonomy_level from trust_grants where action_type='reorder'`;
  if (after?.autonomyLevel !== 'gated') die('revoke did not re-gate');
  ok('undo within window ✓ · revoke toggle re-gated reorders ✓');
}

async function main() {
  const flow = process.argv[2];
  if (flow === '0') await flow0();
  else if (flow === 'A') await flowA();
  else if (flow === 'B') await flowB();
  else if (flow === 'all') { await flow0(); await flowA(); await flowB(); }
  else { console.log('usage: pnpm flow <0|A|B|all>'); process.exit(1); }
  console.log(`\n✅ FLOW ${flow} CLEAN`);
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
