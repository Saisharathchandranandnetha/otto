// Seed: "Priya's Fashion, Jaipur" — the development tenant.
// 30 products with reorder points · 2 suppliers · 8 customers (Rahul owes ₹8,000) ·
// 3 pending invoices · trust history primed with 2 approved reorders (Flow B graduation setup).
//
// NOTE: `pnpm demo:reset` (scripts/demo-reset.ts) is different — it wipes to a BLANK
// business (Flow 0 starts from nothing) while keeping only the 2 pre-seeded approvals.
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto', { max: 1 });

// name · sku · unit_price · stock · reorder_point · reorder_qty · supplier index (0=Sharma, 1=Meena)
const PRODUCTS: [string, string, number, number, number, number, 0 | 1][] = [
  ['Red Cotton Dupatta', 'DUP-RED-01', 250, 18, 10, 20, 0],
  ['Blue Silk Dupatta', 'DUP-BLU-02', 450, 7, 8, 15, 1],
  ['Green Bandhani Dupatta', 'DUP-GRN-03', 380, 12, 8, 15, 0],
  ['Yellow Chiffon Dupatta', 'DUP-YEL-04', 320, 22, 10, 20, 1],
  ['Pink Kurti (M)', 'KUR-PNK-M', 550, 14, 6, 12, 0],
  ['Pink Kurti (L)', 'KUR-PNK-L', 550, 9, 6, 12, 0],
  ['White Chikankari Kurti (M)', 'KUR-WHT-M', 780, 11, 5, 10, 1],
  ['White Chikankari Kurti (L)', 'KUR-WHT-L', 780, 6, 5, 10, 1],
  ['Black Anarkali Kurti', 'KUR-BLK-A', 950, 8, 4, 8, 0],
  ['Kurti Set (Teal)', 'SET-TEL-01', 1250, 5, 4, 8, 0],
  ['Kurti Set (Maroon)', 'SET-MAR-02', 1250, 7, 4, 8, 1],
  ['Cotton Saree (Printed)', 'SAR-CTN-01', 850, 13, 6, 10, 0],
  ['Silk Saree (Banarasi)', 'SAR-SLK-02', 3200, 4, 3, 5, 1],
  ['Georgette Saree', 'SAR-GEO-03', 1450, 9, 5, 8, 1],
  ['Leggings (Black, Free)', 'LEG-BLK-F', 220, 35, 15, 30, 0],
  ['Leggings (White, Free)', 'LEG-WHT-F', 220, 28, 15, 30, 0],
  ['Palazzo Pants (Beige)', 'PAL-BEI-01', 480, 16, 8, 15, 1],
  ['Salwar Suit Fabric Set', 'FAB-SAL-01', 1100, 10, 5, 10, 0],
  ['Blouse Piece (Gold)', 'BLO-GLD-01', 350, 20, 10, 20, 1],
  ['Blouse Piece (Silver)', 'BLO-SLV-02', 350, 17, 10, 20, 1],
  ['Cotton Nightwear Set', 'NGT-CTN-01', 420, 24, 10, 20, 0],
  ['Embroidered Stole', 'STO-EMB-01', 280, 15, 8, 15, 1],
  ['Phulkari Dupatta', 'DUP-PHU-05', 650, 6, 5, 10, 0],
  ['Ajrakh Print Kurti (M)', 'KUR-AJR-M', 720, 9, 5, 10, 1],
  ['Denim Kurti (L)', 'KUR-DNM-L', 680, 12, 6, 12, 0],
  ['Chanderi Suit Set', 'SET-CHA-03', 1850, 5, 3, 6, 1],
  ['Mulmul Saree (Pastel)', 'SAR-MUL-04', 980, 8, 5, 8, 0],
  ['Sharara Set (Rose)', 'SET-SHA-04', 2100, 4, 3, 6, 1],
  ['Cotton Slip (Pack of 3)', 'SLP-CTN-P3', 300, 30, 12, 24, 0],
  ['Festive Potli Bag', 'ACC-POT-01', 260, 19, 8, 16, 1],
];

const CUSTOMERS: [string, string, number][] = [
  ['Rahul Deep', '+91-98290-11111', 8000],
  ['Sunita Devi', '+91-98290-22222', 2500],
  ['Meera Joshi', '+91-98290-33333', 0],
  ['Kavita Sharma', '+91-98290-44444', 4200],
  ['Anil Gupta', '+91-98290-55555', 0],
  ['Pooja Agarwal', '+91-98290-66666', 1800],
  ['Deepak Verma', '+91-98290-77777', 7000],
  ['Ritu Singh', '+91-98290-88888', 0],
];

async function main() {
  console.log('Seeding "Priya\'s Fashion, Jaipur"…');

  await sql`truncate agent_events, ledger_entries, invoices, actions, trust_grants,
            products, customers, suppliers, documents restart identity cascade`;

  const [sharma] = await sql`insert into suppliers (name, phone, aliases) values
    ('Sharma Fabrics', '+91-98761-23456', array['Sharma Fab.', 'Sharma Textiles'])
    returning id`;
  const [meena] = await sql`insert into suppliers (name, phone, aliases) values
    ('Meena Silks', '+91-98123-45678', array['Meena Silk House'])
    returning id`;
  const supplierIds = [sharma!.id, meena!.id] as const;

  for (const [name, sku, price, stock, rp, rq, sup] of PRODUCTS) {
    await sql`insert into products (name, sku, unit_price, stock_qty, reorder_point, reorder_qty, supplier_id)
      values (${name}, ${sku}, ${price}, ${stock}, ${rp}, ${rq}, ${supplierIds[sup]})`;
  }

  for (const [name, phone, dues] of CUSTOMERS) {
    const [c] = await sql`insert into customers (name, phone, dues_amount)
      values (${name}, ${phone}, ${dues}) returning id`;
    if (dues > 0) {
      await sql`insert into ledger_entries (entity_type, entity_id, direction, amount, description)
        values ('customer', ${c!.id}, 'debit', ${dues}, ${'Credit sale — outstanding'})`;
    }
  }

  // 3 pending supplier invoices
  const pending = [
    { sup: 0, no: 'SF-2026-0412', total: 12400, days: -4 },
    { sup: 1, no: 'MS-1129', total: 8750, days: -2 },
    { sup: 0, no: 'SF-2026-0428', total: 5600, days: 3 },
  ];
  for (const p of pending) {
    await sql`insert into invoices (supplier_id, invoice_no, invoice_date, due_date, total, status)
      values (${supplierIds[p.sup as 0 | 1]}, ${p.no},
              current_date - 14, current_date + ${p.days}::int, ${p.total}, 'due')`;
  }

  // Trust history: 2 approved reorders already behind us → the NEXT one triggers graduation.
  await sql`insert into trust_grants (action_type, approvals_count, autonomy_level)
    values ('reorder', 2, 'gated')`;
  for (const [n, total] of [[1, 6300], [2, 4800]] as const) {
    const [a] = await sql`insert into actions (type, status, approved_by, amount, reasoning, payload)
      values ('reorder', 'executed', 'human', ${total},
              ${'Stock fell below reorder point — historical approval #' + n},
              ${sql.json({ seeded: true, po_number: `PO-2026-000${n}` })})
      returning id`;
    await sql`insert into agent_events (action_id, from_state, to_state, detail)
      values (${a!.id}, 'approved', 'executed', ${sql.json({ seeded: true })})`;
  }

  console.log(`✓ ${PRODUCTS.length} products · 2 suppliers · ${CUSTOMERS.length} customers · 3 pending invoices`);
  console.log('✓ Trust history primed: 2 approved reorders (3rd approval triggers graduation)');
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
