// THE APPROVAL GATE — the safety property of the whole system.
// A drafted action reaches `approved` in exactly two ways:
//   1. a human tap (POST /api/approve), or
//   2. an ACTIVE, NON-REVOKED trust grant for this action type whose amount_cap
//      covers the action amount (→ approved_by='autonomy_grant', undo_deadline=+1h).
// There is no third path. Side-effects run only from `approved` (see executors).
//
// [GATE 2 wires human approval; GATE 6 wires autonomy grants. Interface final.]
import { sql } from '@/lib/db';
import { transition, type ActionRow } from './machine';

const UNDO_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** Route a drafted action: auto-approve under an active grant, else await human. */
export async function routeDraftedAction(action: ActionRow): Promise<'auto_approved' | 'awaiting_human'> {
  const [grant] = await sql`
    select * from trust_grants
    where org_id = ${action.orgId}
      and action_type = ${action.type}
      and autonomy_level = 'autonomous'
      and revoked_at is null
      and (amount_cap is null or amount_cap >= ${action.amount ?? 0})`;

  if (grant) {
    const ok = await transition(action.id, 'drafted', 'approved', {
      approvedBy: 'autonomy_grant',
      trustGrantId: grant.id as string,
      undoDeadline: new Date(Date.now() + UNDO_WINDOW_MS),
      detail: { via: 'autonomy_grant', cap: grant.amountCap },
    });
    if (ok) return 'auto_approved';
  }

  await transition(action.id, 'drafted', 'awaiting_approval', {
    detail: grant ? { grant_present_but_over_cap: true } : {},
  });
  return 'awaiting_human';
}
