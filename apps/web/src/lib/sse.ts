// SSE plumbing: agent_events is the source of truth (append-only table); this module
// adds an in-process wake-up channel so the /api/events stream can push instantly
// instead of polling hot. On reconnect, clients resume from their last event id
// (WHERE id > $cursor) — no missed events, no websocket infra.
import { EventEmitter } from 'node:events';

declare global {
  // eslint-disable-next-line no-var
  var __ottoBus: EventEmitter | undefined;
}

export const bus = globalThis.__ottoBus ?? new EventEmitter();
bus.setMaxListeners(50);
if (process.env.NODE_ENV !== 'production') {
  globalThis.__ottoBus = bus;
}

export interface AgentEventInput {
  actionId: string | null;
  fromState: string | null;
  toState: string; // state name, or 'narration' for resurrection build lines
  detail?: Record<string, unknown>;
}

/** Append to the audit trail AND wake the SSE stream. The ONLY way events are written. */
export async function emitAgentEvent(e: AgentEventInput): Promise<void> {
  const { sql } = await import('./db');
  const [row] = await sql`
    insert into agent_events (action_id, from_state, to_state, detail)
    values (${e.actionId}, ${e.fromState}, ${e.toState}, ${sql.json((e.detail ?? {}) as any)})
    returning id, created_at`;
  row && bus.emit('agent_event', {
    id: row.id, actionId: e.actionId, fromState: e.fromState,
    toState: e.toState, detail: e.detail ?? {}, createdAt: row.createdAt,
  });
}
