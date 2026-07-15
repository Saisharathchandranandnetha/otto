// Initial feed snapshot: recent actions (cards), trust grants (meter), entity counts
// (dashboard chips), latest event id (SSE cursor). Live updates then arrive via /api/events.
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [actions, grants, cursor] = await Promise.all([
      sql`select * from actions order by created_at desc limit 50`,
      sql`select * from trust_grants order by action_type`,
      sql`select coalesce(max(id), 0)::int as last_event_id from agent_events`,
    ]);

    const [counts] = await sql`
      select
        (select count(*)::int from products) as products,
        (select count(*)::int from suppliers) as suppliers,
        (select count(*)::int from customers) as customers,
        (select coalesce(sum(customers.dues_amount), 0)::float from customers) as dues,
        (select count(*)::int from products
         where reorder_point is not null and stock_qty <= reorder_point) as low_stock`;

    return NextResponse.json({
      actions,
      grants,
      counts,
      lastEventId: cursor[0]?.lastEventId ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load feed' },
      { status: 500 },
    );
  }
}
