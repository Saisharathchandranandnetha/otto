// Inventory view (server component — plain SQL, revalidated per request).
// Every row shows provenance where it exists: source doc + confidence.
// Low-stock items are sorted to the top so the owner sees what Otto sees.
// Redesigned as M3 cards matching the Stitch design, wrapped in AppShell.
import Link from 'next/link';
import { sql } from '@/lib/db';
import { AppShell } from '@/components/AppShell';

export const dynamic = 'force-dynamic';

const inr = (n: unknown) =>
  n == null ? '—' : new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(n));

export default async function InventoryPage() {
  const [products] = await Promise.all([
    sql`select p.id, p.name, p.sku, p.stock_qty, p.reorder_point, p.reorder_qty, p.unit_price,
               p.confidence, p.source_doc_id, p.created_at,
               s.name as supplier_name, d.file_name as source_file
        from products p
        left join suppliers s on s.id = p.supplier_id
        left join documents d on d.id = p.source_doc_id
        order by (p.reorder_point is not null and p.stock_qty <= p.reorder_point) desc, p.name`,
  ]);

  const productCount = products.length;
  const lowStockCount = products.filter(
    (p: Record<string, unknown>) =>
      p.reorderPoint != null && Number(p.stockQty) <= Number(p.reorderPoint),
  ).length;

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl px-container-padding py-stack-md flex flex-col gap-stack-md">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Inventory
            </h1>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              {productCount} items
              {lowStockCount > 0 && (
                <span className="text-error ml-1">· {lowStockCount} low stock</span>
              )}
            </p>
          </div>
          {/* Tab switcher (Inventory/Ledger mock) */}
          <div className="flex bg-surface-container-high rounded-lg p-1">
            <div className="bg-surface-container-lowest text-on-surface px-4 py-1.5 rounded text-label-sm font-semibold shadow-sm">
              Stock
            </div>
            <Link href="/ledger" className="text-on-surface-variant px-4 py-1.5 rounded text-label-sm hover:text-on-surface transition-colors">
              Ledger
            </Link>
          </div>
        </header>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search products…"
            className="w-full bg-surface-container-low border border-surface-container-highest rounded-full py-2.5 pl-10 pr-4 text-body-md focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-shadow"
          />
        </div>

        {/* Products List */}
        <section className="flex flex-col gap-3">
          {productCount === 0 ? (
            <div className="card py-12 text-center text-body-md text-on-surface-variant flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-4">inventory_2</span>
              <p>No products yet</p>
              <Link href="/resurrection" className="btn-primary mt-6">
                Start the resurrection
              </Link>
            </div>
          ) : (
            products.map((p) => {
              const low = p.reorderPoint != null && Number(p.stockQty) <= Number(p.reorderPoint);
              const maxStock = p.reorderPoint ? Number(p.reorderPoint) * 3 : Math.max(100, Number(p.stockQty) * 2);
              const pct = Math.min(100, (Number(p.stockQty) / maxStock) * 100);

              return (
                <div key={String(p.id)} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-label-lg text-on-surface">{String(p.name)}</h3>
                      <p className="text-label-sm text-on-surface-variant">
                        {String(p.supplierName ?? 'Multiple suppliers')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-label-lg text-primary">{inr(p.unitPrice)}</p>
                      <p className="text-label-sm text-on-surface-variant">per unit</p>
                    </div>
                  </div>

                  {/* Stock Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
                      <span className={low ? 'text-error font-bold' : 'text-on-surface-variant'}>
                        {Number(p.stockQty)} in stock
                      </span>
                      {p.reorderPoint != null && (
                        <span className="text-on-surface-variant">
                          Reorder at {Number(p.reorderPoint)}
                        </span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${low ? 'bg-error' : 'bg-secondary'} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action / Source */}
                  <div className="mt-4 pt-3 border-t border-surface-container-highest flex justify-between items-center">
                    <p className="text-[10px] text-on-surface-variant truncate max-w-[60%]">
                      Source: {String(p.sourceFile ?? 'manual entry')}
                    </p>
                    {low && (
                      <button className="text-label-sm text-secondary hover:underline flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        Order Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Add New Item */}
        <button className="border-2 border-dashed border-outline-variant/50 rounded-xl p-4 text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">add</span>
          <span className="text-label-lg">Add New Product</span>
        </button>
      </main>
    </AppShell>
  );
}
