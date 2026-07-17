// The human side of the Approval Gate.
// POST { actionId, decision: 'approve'|'reject'|'undo', capInr?, edits? }
// Idempotent by construction: transition() is UPDATE ... WHERE status = expected —
// a double-tap's second request matches 0 rows and returns { raced: true }.
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAction, transition } from '@/agent/machine';
import { recordHumanApproval } from '@/agent/trust';
import { execute, undoAction } from '@/agent/executors';
import type { ActionType } from '@/agent/machine';
import { THEME2_ACTION_TYPES } from '@/lib/theme2';

const COUNTS_TOWARD_TRUST: ActionType[] = [
  'reorder',
  'admission_processing',
  'attendance_report',
  ...THEME2_ACTION_TYPES,
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      actionId?: string;
      decision?: string;
      capInr?: number;
    };

    if (!body.actionId || !body.decision) {
      return NextResponse.json(
        { error: 'actionId and decision required' },
        { status: 400 },
      );
    }

    if (!['approve', 'reject', 'undo'].includes(body.decision)) {
      return NextResponse.json(
        { error: `Unknown decision "${body.decision}"` },
        { status: 400 },
      );
    }

    const action = await getAction(body.actionId);
    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    switch (body.decision) {
      case 'approve': {
        // Owner may adjust the autonomy cap on the graduation card
        if (action.type === 'graduation_offer' && body.capInr && body.capInr > 0) {
          await sql`
            update actions set payload = payload || ${sql.json({ cap: body.capInr })}
            where id = ${action.id}`;
        }

        const ok = await transition(action.id, 'awaiting_approval', 'approved', {
          approvedBy: 'human',
          detail: { via: 'human_tap' },
        });
        if (!ok) {
          return NextResponse.json({ raced: true, _note: 'Idempotent no-op — already approved' });
        }

        let offeredGraduation = false;
        if (COUNTS_TOWARD_TRUST.includes(action.type)) {
          const result = await recordHumanApproval(action.orgId, action.type);
          offeredGraduation = result.offeredGraduation;
        }

        await execute(action.id);

        return NextResponse.json({
          ok: true,
          status: 'executed',
          offeredGraduation,
        });
      }

      case 'reject': {
        const ok = await transition(action.id, 'awaiting_approval', 'rejected', {
          detail: { via: 'human_tap' },
        });
        if (!ok) {
          return NextResponse.json({ raced: true, _note: 'Already processed' });
        }
        return NextResponse.json({ ok: true, status: 'rejected' });
      }

      case 'undo': {
        const result = await undoAction(action.id);
        if (!result.ok) {
          return NextResponse.json(
            { error: result.reason ?? 'Undo not possible' },
            { status: 409 },
          );
        }
        return NextResponse.json({ ok: true, status: 'undone' });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message, _note: 'Server error' }, { status: 500 });
  }
}
