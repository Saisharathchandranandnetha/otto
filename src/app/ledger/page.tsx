// Ledger view (server component — plain SQL, revalidated per request).
// Shows customer dues and suppliers as M3 cards, matching the Stitch design.
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

export default async function LedgerPage() {
  const [customers, suppliers] = await Promise.all([
    sql`select c.id, c.name, c.phone, c.dues_amount, c.confidence
        from customers c
        order by c.dues_amount desc, c.name`,
    sql`select s.id, s.name, s.phone, s.aliases, s.confidence
        from suppliers s
        order by s.name`,
  ]);

  const customerCount = customers.length;
  const supplierCount = suppliers.length;
  const totalDues = customers.reduce((sum, c) => sum + Number(c.duesAmount || 0), 0);

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl px-container-padding py-stack-md flex flex-col gap-stack-md">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Ledger
            </h1>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              {inr(totalDues)} total dues
            </p>
          </div>
          {/* Tab switcher */}
          <div className="flex bg-surface-container-high rounded-lg p-1">
            <Link href="/inventory" className="text-on-surface-variant px-4 py-1.5 rounded text-label-sm hover:text-on-surface transition-colors">
              Stock
            </Link>
            <div className="bg-surface-container-lowest text-on-surface px-4 py-1.5 rounded text-label-sm font-semibold shadow-sm">
              Ledger
            </div>
          </div>
        </header>

        {/* Customer Dues Section */}
        <section>
          <h2 className="text-label-lg text-on-surface font-semibold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">groups</span>
            Customer Dues
          </h2>
          
          <div className="flex flex-col gap-3">
            {customerCount === 0 ? (
              <div className="card py-8 text-center text-body-md text-on-surface-variant">
                No customers found
              </div>
            ) : (
              customers.map((c) => {
                const isDue = Number(c.duesAmount) > 0;
                return (
                  <div key={String(c.id)} className="card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <div>
                        <h3 className="text-label-lg text-on-surface">{String(c.name)}</h3>
                        {c.phone ? (
                          <p className="text-label-sm text-on-surface-variant">{String(c.phone)}</p>
                        ) : (
                          <p className="text-label-sm text-on-surface-variant opacity-60">No contact info</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-label-lg ${isDue ? 'text-error' : 'text-on-surface-variant'}`}>
                        {inr(c.duesAmount)}
                      </p>
                      {isDue && (
                        <button className="text-[10px] uppercase tracking-wider text-primary font-semibold hover:underline mt-1">
                          Send Reminder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Suppliers Section */}
        <section className="mt-4">
          <h2 className="text-label-lg text-on-surface font-semibold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">local_shipping</span>
            Suppliers
          </h2>
          
          <div className="flex flex-col gap-3">
            {supplierCount === 0 ? (
              <div className="card py-8 text-center text-body-md text-on-surface-variant">
                No suppliers found
              </div>
            ) : (
              suppliers.map((s) => {
                const aliases = (s.aliases as string[]) || [];
                return (
                  <div key={String(s.id)} className="card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                      </div>
                      <div>
                        <h3 className="text-label-lg text-on-surface">{String(s.name)}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {s.phone && (
                            <p className="text-label-sm text-on-surface-variant">{String(s.phone)}</p>
                          )}
                          {aliases.length > 0 && (
                            <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">
                              aka {aliases[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-secondary hover:bg-secondary/10 p-2 rounded-full transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined">call</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
