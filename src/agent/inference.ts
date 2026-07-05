export interface PurchaseEvent { date: string | null; qty: number; price: number; doc_id: string | null }

export interface InferredProduct {
  name: string;
  purchases: PurchaseEvent[];
  reorder_point: number;
  reorder_qty: number;
  stock_qty: number;
  stock_confidence: number;
  unit_price: number;
  supplier_name: string | null;
}

const COVER_DAYS = 14;
const STOCK_FRACTION = 0.35;
const MARGIN_FACTOR = 0.7;

export function inferProduct(name: string, purchases: PurchaseEvent[], supplierName: string | null): InferredProduct {
  const totalQty = purchases.reduce((s, p) => s + p.qty, 0);
  const avgBatch = Math.ceil(totalQty / purchases.length);
  const dates = purchases.map((p) => p.date).filter((d): d is string => !!d).sort();
  let reorderPoint: number;
  if (dates.length >= 2) {
    const spanDays = Math.max(1, (Date.parse(dates[dates.length - 1]!) - Date.parse(dates[0]!)) / 86_400_000);
    reorderPoint = Math.max(2, Math.ceil((totalQty / spanDays) * COVER_DAYS));
  } else {
    reorderPoint = Math.max(2, Math.ceil(avgBatch * 0.3));
  }
  const lastCost = purchases[purchases.length - 1]!.price;
  return {
    name, purchases, reorder_point: reorderPoint, reorder_qty: avgBatch,
    stock_qty: Math.ceil(avgBatch * STOCK_FRACTION), stock_confidence: 0.6,
    unit_price: Math.round(lastCost / MARGIN_FACTOR), supplier_name: supplierName,
  };
}

export interface LedgerLine {
  party: string; debit: number; credit: number;
  description: string; date: string | null; doc_id: string | null;
}

export function inferDues(lines: LedgerLine[]): Map<string, { net: number; lines: LedgerLine[] }> {
  const byParty = new Map<string, { net: number; lines: LedgerLine[] }>();
  for (const l of lines) {
    const cur = byParty.get(l.party) ?? { net: 0, lines: [] };
    cur.net += l.debit - l.credit;
    cur.lines.push(l);
    byParty.set(l.party, cur);
  }
  return byParty;
}

// THEME 7
export interface BusinessInsight {
  label: string; summary: string; severity: 'low' | 'medium' | 'high';
  suggestion: string; value: number; unit: string;
}

export function inventoryInsights(products: InferredProduct[]): BusinessInsight[] {
  const r: BusinessInsight[] = [];
  const urgent = products.filter((p) => p.stock_qty <= p.reorder_point)
    .map((p) => {
      const cd = avgDailyConsumption(p.purchases);
      return { product: p, daysLeft: cd > 0 ? Math.floor(p.stock_qty / cd) : 999, cd };
    }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 2);
  for (const { product, daysLeft, cd } of urgent) {
    r.push({ label: 'Stock alert', summary: `${product.name} runs out in ~${daysLeft}d${cd > 0 ? ` (${cd.toFixed(1)}/day)` : ''}`, severity: daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low', suggestion: `Reorder ${product.reorder_qty} units`, value: daysLeft, unit: 'days' });
  }
  return r;
}

export function financialInsights(_ss: { name: string; dues_amount?: number }[], cs: { name: string; dues_amount: number }[], all: { total: number; direction: string }[]): BusinessInsight[] {
  const r: BusinessInsight[] = [];
  const top = cs.filter((c) => c.dues_amount > 0).sort((a, b) => b.dues_amount - a.dues_amount).slice(0, 1);
  for (const c of top) r.push({ label: 'Receivable', summary: `${c.name} owes ₹${c.dues_amount.toLocaleString('en-IN')}`, severity: c.dues_amount > 5000 ? 'high' : 'medium', suggestion: `Send reminder to ${c.name}`, value: c.dues_amount, unit: '₹' });
  const ms = all.filter((i) => i.direction === 'purchase').reduce((s, i) => s + i.total, 0);
  if (ms > 0) r.push({ label: 'Spend', summary: `₹${ms.toLocaleString('en-IN')} total supplier spend`, severity: 'low', suggestion: '', value: ms, unit: '₹' });
  return r;
}

function avgDailyConsumption(p: PurchaseEvent[]): number {
  if (p.length < 2) return 0;
  const ds = p.map((x) => x.date).filter((d): d is string => !!d).sort();
  if (ds.length < 2) return 0;
  return p.reduce((s, x) => s + x.qty, 0) / Math.max(1, (Date.parse(ds[ds.length - 1]!) - Date.parse(ds[0]!)) / 86_400_000);
}
