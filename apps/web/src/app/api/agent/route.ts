// Agent controls used by demo scripts and the stage runbook.
// POST { scan: 'reorder' }                       → run the trigger engine now
// POST { simulate_sale: { sku, qty } }           → DEMO LEVER (disclosed): records a
//   quick counter sale to move stock — used to fire the 4th low-stock event live.
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { scanReorderTriggers } from '@/agent/triggers';
import { emitAgentEvent } from '@/lib/sse';
import { runAllDomainPlaybooks, runDomainPlaybook } from '@/agent/domain-engine';
import { THEME2_DOMAIN_SLUGS, type Theme2DomainSlug } from '@/lib/theme2';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      scan?: string;
      simulate_sale?: { sku: string; qty: number };
      run_domain?: Theme2DomainSlug;
      run_theme2_all?: boolean;
    };

    if (body.scan === 'reorder') {
      const result = await scanReorderTriggers();
      return NextResponse.json(result);
    }

    if (body.run_domain) {
      if (!THEME2_DOMAIN_SLUGS.includes(body.run_domain)) {
        return NextResponse.json(
          { error: `Unknown Theme 2 domain "${body.run_domain}"` },
          { status: 400 },
        );
      }
      const result = await runDomainPlaybook(body.run_domain);
      return NextResponse.json({ ok: true, result });
    }

    if (body.run_theme2_all) {
      const results = await runAllDomainPlaybooks();
      return NextResponse.json({ ok: true, results });
    }

    if (body.simulate_sale) {
      const { sku, qty } = body.simulate_sale;
      if (!sku || !qty || qty < 0) {
        return NextResponse.json(
          { error: 'simulate_sale requires { sku: string, qty: positive number }' },
          { status: 400 },
        );
      }

      const [p] = await sql`
        update products set stock_qty = greatest(0, stock_qty - ${qty})
        where sku = ${sku}
        returning name, stock_qty`;

      if (!p) {
        return NextResponse.json({ error: `Product with SKU "${sku}" not found` }, { status: 404 });
      }

      await emitAgentEvent({
        actionId: null,
        fromState: null,
        toState: 'stock_change',
        detail: {
          note: `Counter sale: ${qty} × ${p.name}`,
          stock_now: p.stockQty,
        },
      });

      const scan = await scanReorderTriggers();
      return NextResponse.json({
        ok: true,
        product: p.name,
        stockNow: p.stockQty,
        ...scan,
      });
    }

    return NextResponse.json(
      { error: 'Unknown command. Use { scan: "reorder" }, { run_domain }, { run_theme2_all }, or { simulate_sale }' },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
      return NextResponse.json({ ok: true, mocked: true });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Agent route error' },
      { status: 500 },
    );
  }
}
