// Trust grants: GET = current ladder (drives the TrustMeter) · POST { revoke: actionType }
// = the one-toggle revoke. Revoking is instant and logged; autonomy is re-earnable.
import { NextResponse } from 'next/server';
import { listGrants, revoke } from '@/agent/trust';
import { emitAgentEvent } from '@/lib/sse';
import type { ActionType } from '@/agent/machine';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const orgId = req.headers.get('x-org-id') || '00000000-0000-0000-0000-000000000000';
    const grants = await listGrants(orgId);
    return NextResponse.json({ grants });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch grants' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { revoke?: string };
    if (!body.revoke) {
      return NextResponse.json(
        { error: 'revoke: actionType required' },
        { status: 400 },
      );
    }

    const orgId = req.headers.get('x-org-id') || '00000000-0000-0000-0000-000000000000';
    await revoke(orgId, body.revoke as ActionType);
    await emitAgentEvent({
      actionId: null,
      fromState: null,
      toState: 'trust_revoked',
      detail: {
        action_type: body.revoke,
        note: 'Owner revoked autonomy — back to human-gated.',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to revoke grant' },
      { status: 500 },
    );
  }
}
