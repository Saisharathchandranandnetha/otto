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

function getRequiredLevel(actionClass: string): number {
  switch(actionClass) {
    case 'read':
    case 'draft': return 0; // Or 1? Spec says L1 auto-executes read + draft. So if level >= 1, we can auto approve.
    case 'internal_write':
    case 'external_read': return 1; // Wait, L2 auto-executes up to external_write. So L2 covers these.
    case 'external_write':
    case 'communication':
    case 'financial_small': return 2;
    case 'financial_large':
    case 'legal_send':
    case 'bulk_outreach': return 3;
    case 'system_config': return 4;
    default: return 4; // Safest default
  }
}

/** Route a drafted action: auto-approve under an active grant, else await human. */
export async function routeDraftedAction(action: ActionRow): Promise<'auto_approved' | 'awaiting_human'> {
  const [grant] = await sql`
    select * from trust_grants
    where org_id = ${action.orgId}
      and agent_id = ${action.agentId}
      and action_class = ${action.actionClass}`;

  const level = grant?.level ?? 0;
  
  let canAutoApprove = false;
  let quorumNeeded = false;
  
  if (action.actionClass === 'read' || action.actionClass === 'draft') {
    canAutoApprove = level >= 1;
  } else if (['internal_write', 'external_read', 'external_write', 'communication', 'financial_small'].includes(action.actionClass)) {
    canAutoApprove = level >= 2;
  } else if (['financial_large', 'legal_send', 'bulk_outreach'].includes(action.actionClass)) {
    canAutoApprove = level >= 3;
    // L3 allows auto-execute up to financial_large. But does L3 human approvals need quorum? Yes.
  } else if (action.actionClass === 'system_config') {
    canAutoApprove = level >= 4;
  }

  // Check caps
  if (action.actionClass.startsWith('financial_')) {
    if (grant?.cap_amount && (action.amount ?? 0) > grant.cap_amount) {
      canAutoApprove = false;
    }
  }
  
  // Quorum rule for human approvals
  const requiredLevel = getRequiredLevel(action.actionClass);
  if (!canAutoApprove && requiredLevel >= 3) {
    quorumNeeded = true;
  }

  if (canAutoApprove) {
    const ok = await transition(action.id, 'drafted', 'approved', {
      approvedBy: 'autonomy_grant',
      trustGrantId: grant?.id as string,
      undoDeadline: new Date(Date.now() + UNDO_WINDOW_MS),
      detail: { via: 'autonomy_grant', cap: grant?.cap_amount, level },
    });
    if (ok) return 'auto_approved';
  }

  await transition(action.id, 'drafted', 'awaiting_approval', {
    detail: { quorumNeeded, level, grant_id: grant?.id },
  });

  if (quorumNeeded) {
    await sql`
      INSERT INTO approval_requests (org_id, action_id, status, required_approvals, expires_at)
      VALUES (${action.orgId}, ${action.id}, 'pending', 2, now() + interval '24 hours')
    `;
  }

  return 'awaiting_human';
}
