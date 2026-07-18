// THE TRUST ENGINE — autonomy that is earned, granular, capped, logged,
// reversible, revocable. Per action-type ladder in trust_grants:
//   count human approvals → at >=3 surface a graduation_offer card →
//   owner accepts (sets cap) → gate.ts auto-approves under the cap →
//   one-toggle revoke at any time.
import { sql } from '@/lib/db';
import { createAction, draftAction, transition, type ActionType } from './machine';
import { THEME2_ACTION_TYPES } from '@/lib/theme2';

export const GRADUATION_THRESHOLD = 3;
export const DEFAULT_CAP_INR = 10_000;

/** Action types that can graduate into capped autonomy. */
const GRADUATABLE: ActionType[] = [
  'reorder',
  'admission_processing',
  'attendance_report',
  ...THEME2_ACTION_TYPES,
];

/** Called after every HUMAN approval. Surfaces the graduation card when earned. */
export async function recordHumanApproval(orgId: string, actionType: ActionType): Promise<{ offeredGraduation: boolean }> {
  const [grant] = await sql`
    insert into trust_grants (org_id, action_type, approvals_count)
    values (${orgId}, ${actionType}, 1)
    on conflict (org_id, action_type)
    do update set approvals_count = trust_grants.approvals_count + 1
    returning *`;

  const eligible =
    GRADUATABLE.includes(actionType) &&
    (grant!.approvalsCount as number) >= GRADUATION_THRESHOLD &&
    grant!.autonomyLevel === 'gated' &&
    grant!.offeredAt === null;

  if (!eligible) return { offeredGraduation: false };

  await sql`update trust_grants set offered_at = now() where org_id = ${orgId} and action_type = ${actionType}`;

  // The 🎓 card: an action like any other — drafted by the agent, decided by the human.
  const offer = await createAction({
    orgId,
    agentId: 'system',
    actionClass: 'system',
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
export async function acceptGraduation(orgId: string, actionType: ActionType, capInr: number = DEFAULT_CAP_INR): Promise<void> {
  await sql`
    update trust_grants
    set autonomy_level = 'autonomous', amount_cap = ${capInr}, granted_at = now(), revoked_at = null
    where org_id = ${orgId} and action_type = ${actionType}`;
}

/** One-toggle revoke: next action of this type is human-gated again. Re-earnable. */
export async function revoke(orgId: string, actionType: ActionType): Promise<void> {
  await sql`update trust_grants
            set revoked_at = now(), autonomy_level = 'gated', offered_at = null
            where org_id = ${orgId} and action_type = ${actionType}`;
}

export async function listGrants(orgId: string) {
  return sql`select * from trust_grants where org_id = ${orgId} order by action_type`;
}

/** Time-based confidence decay: unused grants lose confidence over time */
export async function decayStaleGrants(): Promise<void> {
  // Grants not exercised in 30 days have autonomy_level set to 'gated'
  // This runs as a pg-boss scheduled job
  await sql`
    UPDATE trust_grants 
    SET autonomy_level = 'gated', 
        revoked_at = now()
    WHERE autonomy_level = 'autonomous'
      AND granted_at < now() - interval '30 days'
      AND NOT EXISTS (
        SELECT 1 FROM actions 
        WHERE actions.type = trust_grants.action_type 
          AND actions.approved_by = 'autonomy_grant'
          AND actions.created_at > now() - interval '30 days'
      )`;
}
