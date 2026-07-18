// The rule/trigger engine — Otto "noticing". Event-driven: runs after any stock
// mutation. For each product at/below its reorder point with no open reorder,
// the reorder agent wakes: perceive → plan → draft a PO → the Approval Gate
// decides (human card, or auto-execute under an earned trust grant).
import { sql } from '@/lib/db';
import { createAction, draftAction } from './machine';
import { routeDraftedAction } from './gate';
import { execute } from './executors';

/** Purchase cost heuristic when no price history: retail price × 0.7 (documented). */
const PURCHASE_COST_FACTOR = 0.7;

export async function scanReorderTriggers(orgId: string): Promise<{ triggered: string[]; autoExecuted: string[] }> {
  const lowStock = await sql`
    select p.*, s.name as supplier_name, s.phone as supplier_phone
    from products p
    left join suppliers s on s.id = p.supplier_id
    where p.org_id = ${orgId}
      and p.reorder_point is not null
      and p.stock_qty <= p.reorder_point
      and not exists (
        select 1 from actions a
        where a.org_id = ${orgId}
          and a.type = 'reorder'
          and a.status in ('perceived','planned','drafted','awaiting_approval','approved','executing')
          and a.payload->>'product_id' = p.id::text
      )`;

  const triggered: string[] = [];
  const autoExecuted: string[] = [];

  for (const p of lowStock) {
    const qty = Number(p.reorderQty ?? Math.max(Number(p.reorderPoint) * 2, 5));
    const history = (p.priceHistory ?? []) as { price: number }[];
    const unitCost = history.length
      ? history[history.length - 1]!.price
      : Math.round(Number(p.unitPrice ?? 0) * PURCHASE_COST_FACTOR);
    const total = qty * unitCost;

    // Consequence analysis (THEME 7 — every card shows the cost of inaction)
    const pName = p.name as string;
    const stockNow = Number(p.stockQty);
    const [latestSaleQty] = await sql`
      select sum((l->>'qty')::float) as qty
      from invoices, jsonb_array_elements(line_items) l
      where org_id = ${orgId} and status = 'recorded'
      order by created_at desc limit 1`;
    const dailySaleRate = Math.max(
      0.5,
      Number(latestSaleQty?.qty ?? 1) / 30,
    );
    const daysUntilStockout = Math.floor(stockNow / dailySaleRate);
    const [monthSpend] = await sql`
      select coalesce(sum(total)::float, 0) as spent
      from invoices where org_id = ${orgId} and status='due' and created_at > now() - interval '30 days'`;
    const monthlyCap = Math.max(Number(monthSpend?.spent ?? 0) * 1.5, 50000);
    const remainingBudget = Math.max(0, monthlyCap - total);
    const consequence =
      daysUntilStockout <= 7
        ? `If you skip: ${pName} stockout in ~${daysUntilStockout} day${daysUntilStockout !== 1 ? 's' : ''}. Budget left this month: ₹${remainingBudget.toLocaleString('en-IN')}.`
      : `Cash impact: ₹${remainingBudget.toLocaleString('en-IN')} remaining this month after this order.`;

    const reasoning =
      `Stock of ${pName} is ${stockNow} — at/below its reorder point of ${p.reorderPoint}. ` +
      `Drafted: ${qty} units @ ₹${unitCost} (${history.length ? 'last purchase price' : 'est. cost'}) ` +
      `from ${p.supplierName ?? 'usual supplier'} = ₹${total.toLocaleString('en-IN')}. ` +
      consequence;

    const action = await createAction({
      orgId,
      agentId: 'reorder_agent',
      actionClass: 'inventory',
      type: 'reorder',
      amount: total,
      reasoning,
      payload: {
        product_id: p.id, product_name: p.name,
        supplier_id: p.supplierId, supplier_name: p.supplierName, supplier_phone: p.supplierPhone,
        qty, unit_cost: unitCost,
        stock_now: Number(p.stockQty), reorder_point: Number(p.reorderPoint),
        consequence,
        days_until_stockout: daysUntilStockout,
        remaining_budget: Math.round(remainingBudget),
      },
    });
    await draftAction(action.id, { reasoning, detail: { product: p.name, qty, unit_cost: unitCost, total } });

    const route = await routeDraftedAction({ ...action, status: 'drafted' });
    triggered.push(p.name as string);

    if (route === 'auto_approved') {
      await execute(action.id); // the quiet notification card — autonomy at work
      autoExecuted.push(p.name as string);
    }
  }

  return { triggered, autoExecuted };
}
