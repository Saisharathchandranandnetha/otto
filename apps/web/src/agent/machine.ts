// ═══════════════════════════════════════════════════════════════════════════════
// THE AGENT LOOP. Hand-rolled on purpose — no LangGraph, no Temporal.
// Judges: this file + gate.ts + trust.ts IS the agent. ~200 lines, fully inspectable.
//
// Design: an action is a DB row. A transition is one
//   UPDATE actions SET status = next WHERE id = $id AND status = $expected
// inside a transaction that also appends an agent_events row (the audit trail /
// live trace). If the UPDATE matches 0 rows, someone got there first — the
// transition is a no-op. That single property gives us idempotent approvals:
// double-taps, SSE replays, and re-fired triggers cannot double-execute.
// State lives in Postgres, not memory → the loop survives restarts (durability).
// ═══════════════════════════════════════════════════════════════════════════════
import { sql } from '@/lib/db';
import { emitAgentEvent } from '@/lib/sse';
import type { Theme2ActionType } from '@/lib/theme2';

export type ActionType =
  | 'invoice_commit'
  | 'reorder'
  | 'payment_reminder'
  | 'graduation_offer'
  | 'resurrection_commit'
  | 'admission_processing'
  | 'attendance_report'
  | Theme2ActionType;

export type ActionStatus =
  | 'perceived'
  | 'planned'
  | 'drafted'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'executing'
  | 'executed'
  | 'undone'
  | 'failed';

/** The only legal edges. Anything else throws — no improvised shortcuts at 3am. */
const TRANSITIONS: Record<ActionStatus, ActionStatus[]> = {
  perceived: ['planned', 'failed'],
  planned: ['drafted', 'failed'],
  drafted: ['awaiting_approval', 'approved', 'failed'], // 'approved' directly = autonomy grant (gate.ts)
  awaiting_approval: ['approved', 'rejected'],
  approved: ['executing', 'failed'],
  executing: ['executed', 'failed'],
  executed: ['undone'], // within undo_deadline only (enforced in undo executor)
  rejected: [],
  undone: [],
  failed: [],
};

export interface ActionRow {
  id: string;
  orgId: string;
  agentId: string;
  actionClass: string;
  channel: string | null;
  type: ActionType;
  status: ActionStatus;
  payload: Record<string, unknown>;
  reasoning: string | null;
  amount: number | null;
  approvedBy: 'human' | 'autonomy_grant' | null;
  trustGrantId: string | null;
  undoDeadline: Date | null;
  undoPayload: Record<string, unknown> | null;
  undoneAt: Date | null;
  undoneBy: string | null;
  createdAt: Date;
}

/** Create a new action in `perceived` and log its birth. */
export async function createAction(input: {
  orgId: string;
  agentId: string;
  actionClass: string;
  channel?: string;
  type: ActionType;
  payload?: Record<string, unknown>;
  reasoning?: string;
  amount?: number;
}): Promise<ActionRow> {
  const [row] = await sql`
    insert into actions (org_id, agent_id, action_class, channel, type, payload, reasoning, amount)
    values (${input.orgId}, ${input.agentId}, ${input.actionClass}, ${input.channel ?? null}, ${input.type}, ${sql.json((input.payload ?? {}) as any)},
            ${input.reasoning ?? null}, ${input.amount ?? null})
    returning *`;
  const action = row as unknown as ActionRow;
  await emitAgentEvent({
    actionId: action.id,
    fromState: null,
    toState: 'perceived',
    detail: { type: input.type, reasoning: input.reasoning },
  });
  return action;
}

/**
 * Attempt a transition. Returns the updated row, or null if the action was not in
 * `from` (concurrent actor won the race — caller treats as a clean no-op).
 */
export async function transition(
  actionId: string,
  from: ActionStatus,
  to: ActionStatus,
  patch: {
    approvedBy?: 'human' | 'autonomy_grant';
    trustGrantId?: string;
    undoDeadline?: Date;
    payloadMerge?: Record<string, unknown>;
    detail?: Record<string, unknown>;
  } = {},
): Promise<ActionRow | null> {
  if (!TRANSITIONS[from]?.includes(to)) {
    throw new Error(`illegal transition ${from} → ${to}`);
  }

  const updated = await sql.begin(async (tx) => {
    const [row] = await tx`
      update actions set
        status        = ${to},
        approved_by   = coalesce(${patch.approvedBy ?? null}, approved_by),
        trust_grant_id= coalesce(${patch.trustGrantId ?? null}, trust_grant_id),
        undo_deadline = coalesce(${patch.undoDeadline ?? null}, undo_deadline),
        payload       = payload || ${tx.json((patch.payloadMerge ?? {}) as any)},
        updated_at    = now()
      where id = ${actionId} and status = ${from}
      returning *`;
    if (!row) return null; // 0 rows = lost the race = idempotent no-op
    await tx`
      insert into agent_events (action_id, from_state, to_state, detail)
      values (${actionId}, ${from}, ${to}, ${tx.json((patch.detail ?? {}) as any)})`;
    return row as unknown as ActionRow;
  });

  if (updated) {
    // wake SSE listeners (row already persisted above — bus is just the nudge)
    const { bus } = await import('@/lib/sse');
    bus.emit('agent_event', {
      actionId,
      fromState: from,
      toState: to,
      detail: patch.detail ?? {},
    });
  }
  return updated;
}

/** Drive a fresh action through perceive → plan → draft with narrated details. */
export async function draftAction(
  actionId: string,
  plan: { reasoning: string; detail?: Record<string, unknown> },
): Promise<void> {
  await transition(actionId, 'perceived', 'planned', { detail: { reasoning: plan.reasoning } });
  await sql`update actions set reasoning = ${plan.reasoning} where id = ${actionId}`;
  await transition(actionId, 'planned', 'drafted', { detail: plan.detail ?? {} });
}

export async function getAction(actionId: string): Promise<ActionRow | null> {
  const [row] = await sql`select * from actions where id = ${actionId}`;
  return (row as unknown as ActionRow) ?? null;
}
