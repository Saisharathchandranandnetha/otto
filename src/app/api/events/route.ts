// SSE stream of agent_events. Client sends ?cursor=<last seen id>; we replay the
// backlog from the table (source of truth), then push live via the in-process bus.
// Reconnects resume cleanly — no missed events, no websocket infra.
import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { bus } from '@/lib/sse';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // SSE streams can be long-lived

export async function GET(req: NextRequest) {
  const cursor = Number(req.nextUrl.searchParams.get('cursor') ?? 0);
  const encoder = new TextEncoder();

  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        if (!closed) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch {
            // stream may be closed already
          }
        }
      };

      // 1. Backlog from the audit trail
      try {
        const backlog = await sql`
          select e.id, e.action_id, e.from_state, e.to_state, e.detail, e.created_at,
                 a.type as action_type, a.status as action_status
          from agent_events e
          left join actions a on a.id = e.action_id
          where e.id > ${cursor}
          order by e.id asc
          limit 500`;
        for (const row of backlog) send(row);
      } catch {
        send({ error: 'backlog fetch failed' });
      }

      // 2. Live pushes
      const onEvent = (e: unknown) => send(e);
      bus.on('agent_event', onEvent);

      // 3. Heartbeat keeps proxies from killing the stream
      const heartbeat = setInterval(() => {
        if (!closed) {
          try {
            controller.enqueue(encoder.encode(': ping\n\n'));
          } catch {
            clearInterval(heartbeat);
          }
        }
      }, 15_000);

      // 4. Cleanup
      req.signal.addEventListener('abort', () => {
        closed = true;
        bus.off('agent_event', onEvent);
        clearInterval(heartbeat);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
