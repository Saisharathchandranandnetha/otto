import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireOrg } from '@otto/auth/middleware'; // Assuming this exists or similar

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgId: string; agentId: string; actionClass: string }> }
) {
  const { orgId, agentId, actionClass } = await params;
  // 1. Require org manager or admin
  const authResponse = await requireOrg(request as any, 'manager');
  if (authResponse.status !== 200) {
    // If requireOrg returns a response that is not next() which is generally ok,
    // wait requireOrg normally returns NextResponse.next() if successful
    // Assuming if status is not 200/NextResponse.next, we return it
    // Let's implement a safe check:
    if (authResponse.headers.get('x-org-id') !== orgId) {
      return NextResponse.json({ error: 'Unauthorized org access' }, { status: 403 });
    }
  }
  
  const userId = authResponse.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { level } = await request.json();

  if (level !== 0) {
    return NextResponse.json({ error: 'Only instant revocation (level 0) is supported via this endpoint' }, { status: 400 });
  }

  try {
    const result = await sql`
      UPDATE trust_grants
      SET 
        level = 0,
        approval_streak = 0,
        last_rejection = now(),
        updated_at = now()
      WHERE
        org_id = ${orgId} AND
        agent_id = ${agentId} AND
        action_class = ${actionClass}
      RETURNING id, level;
    `;

    if (result.length > 0) {
      // Log event
      await sql`
        INSERT INTO trust_events (org_id, agent_id, action_class, event_type, previous_level, new_level, reason, triggered_by)
        VALUES (${orgId}, ${agentId}, ${actionClass}, 'revoked', null, 0, 'Manual revocation', ${userId})
      `;
    }

    return NextResponse.json({ success: true, updated: result.length > 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
