'use client';
// Trust Meter Strip — horizontal scrolling circular progress meters.
// Each action type shows a circular SVG ring with approvals count inside,
// matching the Stitch approval_feed header pattern.
import { useState, useCallback } from 'react';
import { inr, type Grant } from './useOtto';

const LABELS: Record<string, [string, string]> = {
  reorder: ['Reorder', 'Purchase Orders'],
  invoice_commit: ['Invoice', 'Verification'],
  payment_reminder: ['Payment', 'Reminders'],
};

const GRADUATION_TARGET = 3;

function CircularProgress({ current, total, color }: { current: number; total: number; color: string }) {
  const pct = Math.round((current / total) * 100);
  const dashArray = `${pct}, 100`;
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-surface-container-highest stroke-current"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        />
        <path
          className={`${color} stroke-current`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeDasharray={dashArray}
          strokeWidth="3"
        />
      </svg>
      <span className="absolute text-label-sm text-on-surface font-semibold">
        {current}/{total}
      </span>
    </div>
  );
}

export function TrustMeter({
  grants,
  onRevoke,
}: {
  grants: Grant[];
  onRevoke: (t: string) => Promise<void>;
}) {
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleRevoke = useCallback(
    async (type: string) => {
      setRevoking(type);
      try {
        await onRevoke(type);
      } finally {
        setRevoking(null);
      }
    },
    [onRevoke],
  );

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
      {grants.map((g) => {
        const [topLabel, bottomLabel] = LABELS[g.actionType] ?? [g.actionType, ''];
        const autonomous = g.autonomyLevel === 'autonomous';
        const current = autonomous ? g.approvalsCount : g.approvalsCount;
        const total = autonomous ? g.approvalsCount : GRADUATION_TARGET;
        const ringColor = autonomous
          ? 'text-secondary'
          : current / total < 0.4
            ? 'text-error'
            : 'text-secondary';

        return (
          <div
            key={g.actionType}
            className="flex-shrink-0 snap-center flex items-center gap-3
                       bg-surface rounded-lg p-2 pr-4 border border-outline-variant/30"
          >
            <CircularProgress current={current} total={total} color={ringColor} />
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">{topLabel}</span>
              <span className="text-label-sm text-on-surface font-semibold">{bottomLabel}</span>
              {autonomous && (
                <span className="text-[10px] text-secondary mt-0.5">
                  ≤ {inr(g.amountCap)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
