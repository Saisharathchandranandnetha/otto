// Agent controls used by demo scripts and the stage runbook.
// POST { scan: 'reorder' }                       → run the trigger engine now
// POST { simulate_sale: { sku, qty } }           → DEMO LEVER (disclosed): records a
//   quick counter sale to move stock — used to fire the 4th low-stock event live.
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { scanReorderTriggers } from '@/agent/triggers';
import { emitAgentEvent } from '@/lib/sse';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      scan?: string;
      simulate_sale?: { sku: string; qty: number };
    };

    if (body.scan === 'reorder') {
      const result = await scanReorderTriggers();
      return NextResponse.json(result);
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
      { error: 'Unknown command. Use { scan: "reorder" } or { simulate_sale: { sku, qty } }' },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Agent route error' },
      { status: 500 },
    );
  }
}
