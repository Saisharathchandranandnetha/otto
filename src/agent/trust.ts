// THE TRUST ENGINE — autonomy that is earned, granular, capped, logged,
// reversible, revocable. Per action-type ladder in trust_grants:
//   count human approvals → at >=3 surface a graduation_offer card →
//   owner accepts (sets cap) → gate.ts auto-approves under the cap →
//   one-toggle revoke at any time.
import { sql } from '@/lib/db';
import { createAction, draftAction, transition, type ActionType } from './machine';

export const GRADUATION_THRESHOLD = 3;
export const DEFAULT_CAP_INR = 10_000;

/** Action types that can graduate (Flow C's payment_reminder joins later). */
const GRADUATABLE: ActionType[] = ['reorder'];

/** Called after every HUMAN approval. Surfaces the graduation card when earned. */
export async function recordHumanApproval(actionType: ActionType): Promise<{ offeredGraduation: boolean }> {
  const [grant] = await sql`
    insert into trust_grants (action_type, approvals_count)
    values (${actionType}, 1)
    on conflict (action_type)
    do update set approvals_count = trust_grants.approvals_count + 1
    returning *`;

  const eligible =
    GRADUATABLE.includes(actionType) &&
    (grant!.approvalsCount as number) >= GRADUATION_THRESHOLD &&
    grant!.autonomyLevel === 'gated' &&
    grant!.offeredAt === null;

  if (!eligible) return { offeredGraduation: false };

  await sql`update trust_grants set offered_at = now() where action_type = ${actionType}`;

  // The 🎓 card: an action like any other — drafted by the agent, decided by the human.
  const offer = await createAction({
    type: 'graduation_offer',
    payload: {
      action_type: actionType,
      approvals_count: grant!.approvalsCount,
      cap: DEFAULT_CAP_INR,
      conditions: ['same trusted supplier', `total under ₹${DEFAULT_CAP_INR.toLocaleString('en-IN')}`],
    },
    reasoning: `You've approved ${grant!.approvalsCount} ${actionType}s like this one. Otto is ready to handle them itself — capped, logged, reversible for 1 hour, revocable anytime.`,
  });
  await draftAction(offer.id, { reasoning: offer.reasoning ?? '', detail: { card: 'graduation' } });
  await transition(offer.id, 'drafted', 'awaiting_approval', { detail: { card: 'graduation' } });
  return { offeredGraduation: true };
}

/** Owner tapped "Earn it, Otto" (executor calls this; cap is owner-adjustable). */
export async function acceptGraduation(actionType: ActionType, capInr: number = DEFAULT_CAP_INR): Promise<void> {
  await sql`
    update trust_grants
    set autonomy_level = 'autonomous', amount_cap = ${capInr}, granted_at = now(), revoked_at = null
    where action_type = ${actionType}`;
}

/** One-toggle revoke: next action of this type is human-gated again. Re-earnable. */
export async function revoke(actionType: ActionType): Promise<void> {
  await sql`update trust_grants
            set revoked_at = now(), autonomy_level = 'gated', offered_at = null
            where action_type = ${actionType}`;
}

export async function listGrants() {
  return sql`select * from trust_grants order by action_type`;
}
