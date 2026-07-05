'use client';
// Live agent trace — every perceived/planned/drafted/approved/executed step,
// straight from agent_events. Restyled with M3 warm palette tokens.
import { useEffect, useRef } from 'react';
import type { OttoEvent } from './useOtto';

const EVENT_COLORS: Record<string, string> = {
  perceived: 'text-on-surface-variant/60',
  planned: 'text-on-surface-variant',
  drafted: 'text-on-surface',
  awaiting_approval: 'text-primary',
  approved: 'text-primary',
  executing: 'text-[#f57f17]',
  executed: 'text-secondary',
  rejected: 'text-error',
  failed: 'text-error',
  undone: 'text-[#f57f17]',
  narration: 'text-on-surface-variant',
  whatsapp_send: 'text-secondary',
  trust_revoked: 'text-error',
  stock_change: 'text-on-surface-variant/60',
};

function formatTime(dateStr: string | undefined): string {
  if (!dateStr) return '·';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return dateStr.slice(11, 19) || '·';
  }
}

export function ActivityTrace({ events }: { events: OttoEvent[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!endRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    if (isNearBottom) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [events.length]);

  return (
    <div className="card">
      <h2 className="mb-2 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Agent Activity Trace
      </h2>
      {events.length === 0 ? (
        <p className="py-6 text-center text-label-sm text-on-surface-variant">
          Waiting for agent activity…
        </p>
      ) : (
        <div
          ref={containerRef}
          className="max-h-64 space-y-0 overflow-y-auto font-mono text-[11px] leading-relaxed"
        >
          {events.map((e, i) => (
            <p
              key={e.id ?? `live-${i}`}
              className="animate-tick-up flex items-baseline gap-2"
            >
              <span className="shrink-0 text-on-surface-variant/40">
                {formatTime(e.createdAt)}
              </span>
              <span className={EVENT_COLORS[e.toState] ?? 'text-on-surface'}>
                {e.toState === 'narration'
                  ? String(e.detail.line ?? '')
                  : e.toState === 'whatsapp_send'
                    ? `✉ ${String(e.detail.body ?? '').slice(0, 60)}…`
                    : e.toState === 'trust_revoked'
                      ? '🛑 Autonomy revoked'
                      : `${e.actionType ?? String(e.detail.type ?? '')}${e.fromState ? ` ${e.fromState}→${e.toState}` : ' ' + e.toState}`}
              </span>
              {e.detail.error ? (
                <span className="text-error">· {String(e.detail.error).slice(0, 40)}</span>
              ) : null}
              {e.detail.step ? (
                <span className="text-on-surface-variant/60">· {String(e.detail.step)}</span>
              ) : null}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
