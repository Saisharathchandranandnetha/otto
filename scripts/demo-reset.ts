// ONE-COMMAND DEMO RESET — restores the exact stage-demo starting state:
//   * BLANK business (Flow 0 "Resurrection" starts from nothing)
//   * trust history primed with 2 approved reorders (so Flow B's approval is the 3rd → graduation)
// Run between rehearsals. Never demo on polluted data.
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto', { max: 1 });

async function main() {
  console.log('Resetting to pristine demo state…');

  await sql`truncate agent_events, ledger_entries, invoices, actions, trust_grants,
            products, customers, suppliers, documents restart identity cascade`;

  // Pre-seeded approval history (invisible until Flow B needs it)
  await sql`insert into trust_grants (action_type, approvals_count, autonomy_level)
    values ('reorder', 2, 'gated')`;
  for (const [n, total] of [[1, 6300], [2, 4800]] as const) {
    const daysAgo = n === 1 ? 9 : 4;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const [a] = await sql`insert into actions (type, status, approved_by, amount, reasoning, payload, created_at)
      values ('reorder', 'executed', 'human', ${total},
              ${'Stock fell below reorder point — historical approval #' + n},
              ${sql.json({ seeded: true, po_number: `PO-2026-000${n}` })},
              ${createdAt})
      returning id`;
    await sql`insert into agent_events (action_id, from_state, to_state, detail)
      values (${a!.id}, 'approved', 'executed', ${sql.json({ seeded: true })})`;
  }

  console.log('✓ Blank business (Flow 0 ready) + 2 pre-seeded reorder approvals (Flow B graduation ready)');
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
