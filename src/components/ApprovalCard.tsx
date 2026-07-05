'use client';
// THE HERO COMPONENT — Stitch M3 card redesign.
// One card per action; variant by type + status.
// Cards use M3 surfaces with soft shadows, pill-shaped buttons,
// Material Symbols icons, and 48px touch targets.
import { useState, useCallback } from 'react';
import { inr, type FeedAction } from './useOtto';

const REVIEW_THRESHOLD = 0.75;

interface Props {
  action: FeedAction;
  onAct: (id: string, decision: 'approve' | 'reject' | 'undo', capInr?: number) => Promise<unknown>;
}

// ── Undo timer display ───────────────────────────────────────────────────
function UndoTimer({ deadline }: { deadline: string }) {
  const ms = new Date(deadline).getTime() - Date.now();
  const mins = Math.max(0, Math.floor(ms / 60_000));
  return (
    <button className="text-label-lg text-primary hover:underline flex items-center gap-1 h-touch-target-min px-2">
      <span className="material-symbols-outlined text-[18px]">undo</span>
      Undo <span className="font-normal opacity-80">({mins}m left)</span>
    </button>
  );
}

export function ApprovalCard({ action, onAct }: Props) {
  const [busy, setBusy] = useState(false);
  const [cap, setCap] = useState<number>(
    Number((action.payload.cap as number | undefined) ?? 10000),
  );

  const run = useCallback(
    async (decision: 'approve' | 'reject' | 'undo') => {
      setBusy(true);
      try {
        await onAct(
          action.id,
          decision,
          action.type === 'graduation_offer' ? cap : undefined,
        );
      } finally {
        setBusy(false);
      }
    },
    [action.id, action.type, cap, onAct],
  );

  const auto = action.approvedBy === 'autonomy_grant';
  const undoOpen = action.undoDeadline && new Date(action.undoDeadline) > new Date();

  // ── Auto-executed notification (reduced opacity, teal check) ──────────
  if (auto && (action.status === 'executed' || action.status === 'executing')) {
    return (
      <article className="card relative opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-start gap-4">
          <div className="bg-surface-container-highest p-3 rounded-full flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant">check_circle</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-secondary-container text-on-secondary-container text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Auto-approved
              </span>
            </div>
            <p className="text-body-md text-on-surface line-through decoration-on-surface-variant/50">
              {action.reasoning
                ? action.reasoning.split('.')[0] + '.'
                : `${action.type} — ${inr(action.amount)}`}
            </p>
          </div>
        </div>
        {undoOpen && (
          <div className="flex justify-end mt-2">
            <button
              className="text-label-lg text-primary hover:underline flex items-center gap-1 h-touch-target-min px-2"
              disabled={busy}
              onClick={() => void run('undo')}
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
              {busy ? 'Working…' : (
                <>Undo <span className="font-normal opacity-80">({Math.max(0, Math.floor((new Date(action.undoDeadline!).getTime() - Date.now()) / 60_000))}m left)</span></>
              )}
            </button>
          </div>
        )}
        {!!action.payload.pdf && (
          <div className="flex justify-end mt-1">
            <a
              href={String(action.payload.pdf)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-sm text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">description</span>
              View PO
            </a>
          </div>
        )}
      </article>
    );
  }

  // ── Graduation card: 🎓 earn autonomy ────────────────────────────────
  if (action.type === 'graduation_offer') {
    const actionType = String(action.payload.action_type ?? '');
    if (action.status !== 'awaiting_approval') {
      return (
        <article className="card py-3 text-body-md text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">school</span>
            <span>
              {actionType} autonomy:{' '}
              {action.status === 'executed'
                ? `Granted — capped at ${inr(Number(action.payload.cap ?? 10000))}`
                : 'Declined for now'}
            </span>
          </div>
        </article>
      );
    }
    return (
      <article className="card-accent">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-headline-sm text-on-surface">Otto is ready for more</h3>
            <p className="mt-2 text-body-md text-on-surface-variant">
              You&apos;ve approved {String(action.payload.approvals_count ?? '')} {actionType}s
              like this one. Otto can handle them itself —
              <strong className="text-on-surface"> capped, logged, reversible, revocable</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-body-md">
          <span className="text-on-surface-variant">Cap:</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
            <input
              type="number"
              value={cap}
              min={500}
              step={500}
              onChange={(e) => setCap(Number(e.target.value))}
              className="input w-32 pl-7"
            />
          </div>
        </div>

        <p className="mt-2 text-label-sm text-on-surface-variant">
          Every auto-action is logged, notified, reversible for one hour, and revocable with one toggle at any time.
        </p>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-surface-container-highest">
          <div />
          <div className="flex gap-2">
            <button className="btn-ghost" disabled={busy} onClick={() => void run('reject')}>
              Not yet
            </button>
            <button className="btn-secondary flex-1" disabled={busy} onClick={() => void run('approve')}>
              {busy ? 'Working…' : 'Earn it, Otto'}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ── Resurrection summary ─────────────────────────────────────────────
  if (action.type === 'resurrection_commit') {
    const s = (action.payload.summary ?? {}) as Record<string, number>;
    const done = action.status === 'executed';
    return (
      <article className={`card ${done ? '' : 'card-accent'}`}>
        <div className="flex items-start gap-4">
          <div className="bg-secondary/10 p-3 rounded-full flex-shrink-0">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              {done ? 'check_circle' : 'store'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-headline-sm text-on-surface">
              {done ? 'Your business is live' : 'Is this your business?'}
            </h3>
          </div>
        </div>

        {/* Stats bento */}
        <div className="mt-4 flex justify-between bg-surface-container p-3 rounded-xl border border-outline-variant/50">
          {[
            ['Products', s.products],
            ['Contacts', (s.suppliers ?? 0) + (s.customers ?? 0)],
            ['Invoices', s.invoices ?? '—'],
          ].map(([label, v], idx) => (
            <div
              key={String(label)}
              className={`text-center w-1/3 ${idx < 2 ? 'border-r border-outline-variant/30' : ''}`}
            >
              <p className="text-headline-sm text-on-surface">{v ?? 0}</p>
              <p className="text-[10px] text-label-sm text-on-surface-variant uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Insight tiles */}
        {Array.isArray(action.payload.insights) && (action.payload.insights as Record<string, unknown>[]).length > 0 ? (
          <div className="mt-4 space-y-2">
            {(action.payload.insights as { summary: string; severity: string; suggestion: string }[]).slice(0, 3).map((ins, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg border p-2.5 text-label-sm ${
                  ins.severity === 'high' ? 'border-error/30 bg-error/5 text-error'
                  : ins.severity === 'medium' ? 'border-[#fbc02d]/30 bg-[#fff9c4] text-[#f57f17]'
                  : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">
                  {ins.severity === 'high' ? 'error' : ins.severity === 'medium' ? 'warning' : 'info'}
                </span>
                <div>
                  <p className="font-semibold">{ins.summary}</p>
                  <p className="mt-0.5 opacity-80">{ins.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-3 text-body-md text-on-surface-variant">
          <p>{inr(s.totalDuesInr)} in customer dues</p>
          {(s.belowReorderPoint ?? 0) > 0 && (
            <p className="text-[#f57f17]">{s.belowReorderPoint} items below safe stock</p>
          )}
        </div>

        <p className="mt-2 text-label-sm text-on-surface-variant">
          Every entity is tagged with its source document and confidence. Nothing is live yet.
        </p>

        {!done && action.status === 'awaiting_approval' && (
          <div className="mt-4 flex flex-col gap-3">
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={busy}
              onClick={() => void run('approve')}
            >
              {busy ? 'Working…' : 'This is my business'}
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
            <button
              className="btn-ghost w-full"
              disabled={busy}
              onClick={() => void run('reject')}
            >
              Something&apos;s off
            </button>
          </div>
        )}
      </article>
    );
  }

  // ── Invoice / Reorder cards (Stitch pattern) ─────────────────────────
  const lines = (action.payload.lines ?? []) as {
    product_name: string;
    qty: number;
    unit_price: number;
    amount: number;
  }[];
  const conf = (action.payload.field_confidence ?? {}) as Record<string, number>;
  const lowFields = Object.entries(conf).filter(
    ([, c]) => c != null && c < REVIEW_THRESHOLD,
  );
  const hasLowConfidence = lowFields.length > 0 && action.status === 'awaiting_approval';

  // Card icon + type label
  const isReorder = action.type === 'reorder';
  const isSale = action.payload.direction === 'sale';
  const iconName = isReorder ? 'shopping_cart' : isSale ? 'receipt_long' : 'description';
  const iconBg = isReorder ? 'bg-primary-container/20' : isSale ? 'bg-secondary-container/30' : 'bg-tertiary-container/30';
  const iconColor = isReorder ? 'text-primary' : isSale ? 'text-secondary' : 'text-tertiary';

  return (
    <article className="card relative overflow-hidden transform transition-transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Icon circle */}
        <div className={`${iconBg} p-3 rounded-full flex-shrink-0`}>
          <span
            className={`material-symbols-outlined ${iconColor}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {iconName}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-body-md text-on-surface mb-2">
            {isReorder ? (
              <>
                Reorder <span className="font-semibold">{action.payload.qty ? `${action.payload.qty} units` : ''}</span>
                {action.payload.product_name && (
                  <> of <span className="font-semibold">{String(action.payload.product_name)}</span></>
                )}
                {action.payload.supplier_name && (
                  <> from {String(action.payload.supplier_name)}</>
                )}
                {action.payload.stock_now != null && ' — stock is below reorder point.'}
              </>
            ) : action.payload.counterparty ? (
              <>
                {isSale ? 'Sale to' : 'Invoice from'}{' '}
                <span className="font-semibold">{String(action.payload.counterparty)}</span>
                {action.amount != null && (
                  <span className="text-primary font-semibold"> {inr(action.amount)}</span>
                )}
              </>
            ) : (
              <>
                {action.reasoning?.split('.')[0] ?? action.type}
                {action.amount != null && (
                  <span className="text-primary font-semibold"> {inr(action.amount)}</span>
                )}
              </>
            )}
          </p>

          {/* Reasoning quote box */}
          {action.reasoning && isReorder && (
            <div className="bg-surface-container-low p-2 rounded border border-surface-dim mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">lightbulb</span>
              <p className="text-label-sm text-on-surface-variant italic">
                Reasoning: {action.reasoning.includes('Stock of')
                  ? action.reasoning.split('. ').slice(1, 2).join('. ')
                  : action.reasoning.split('.').slice(0, 2).join('.') + '.'}
              </p>
            </div>
          )}

          {/* Low confidence highlight (Stitch yellow box) */}
          {hasLowConfidence && action.amount != null && (
            <div className="inline-flex flex-col mb-2">
              <div className="field-review px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#fff59d] transition-colors group">
                <span className="text-headline-sm text-[#f57f17]">{inr(action.amount)}</span>
                <span className="material-symbols-outlined text-[#fbc02d] text-[18px] group-hover:scale-110 transition-transform">
                  edit
                </span>
              </div>
              <span className="text-label-sm text-on-surface-variant mt-1 ml-1 opacity-80">
                Tap amount to confirm/edit (low confidence read)
              </span>
            </div>
          )}

          {/* Line items table (compact) */}
          {lines.length > 0 && !hasLowConfidence && (
            <div className="mt-2 space-y-1">
              {lines.slice(0, 3).map((l, i) => (
                <div key={i} className="flex justify-between text-label-sm text-on-surface-variant">
                  <span>{l.product_name}</span>
                  <span className="font-mono">{l.qty} × {inr(l.unit_price)}</span>
                </div>
              ))}
              {lines.length > 3 && (
                <p className="text-label-sm text-on-surface-variant opacity-70">
                  +{lines.length - 3} more items
                </p>
              )}
            </div>
          )}

          {/* Consequence line */}
          {isReorder && !!action.payload.consequence && (
            <div className={`mt-2 flex items-start gap-1.5 rounded-lg border px-3 py-2 text-label-sm ${
              Number(action.payload.days_until_stockout ?? 99) <= 3
                ? 'border-error/30 bg-error/5 text-error'
                : Number(action.payload.days_until_stockout ?? 99) <= 7
                  ? 'border-[#fbc02d]/30 bg-[#fff9c4] text-[#f57f17]'
                  : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">trending_down</span>
              <span>{String(action.payload.consequence)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-surface-container-highest">
        {/* Source reference */}
        <div className="flex items-center gap-1 text-on-surface-variant opacity-70">
          <span className="material-symbols-outlined text-[16px]">
            {isReorder ? 'inventory_2' : 'receipt_long'}
          </span>
          <span className="text-label-sm">
            {isReorder
              ? 'Inventory Log'
              : action.payload.invoice_no
                ? `Invoice #${String(action.payload.invoice_no)}`
                : 'Document'}
          </span>
        </div>

        {/* Action buttons */}
        {action.status === 'awaiting_approval' && (
          <div className="flex gap-2">
            <button
              className="h-touch-target-min px-4 text-label-lg rounded-full border border-outline text-on-surface
                         hover:bg-surface-container-high transition-colors flex items-center justify-center"
              disabled={busy}
              onClick={() => void run('reject')}
            >
              Reject
            </button>
            <button
              className="h-touch-target-min px-6 text-label-lg rounded-full bg-secondary text-on-secondary
                         hover:opacity-90 transition-opacity flex items-center justify-center shadow-sm"
              disabled={busy}
              onClick={() => void run('approve')}
            >
              {busy ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </span>
              ) : hasLowConfidence ? 'Confirm Record' : 'Approve'}
            </button>
          </div>
        )}

        {/* Executed states */}
        {(action.status === 'executed' || action.status === 'rejected' || action.status === 'failed') && (
          <span className={`text-label-sm uppercase tracking-wider ${
            action.status === 'executed' ? 'text-secondary' : 'text-error'
          }`}>
            {action.status === 'executed' ? 'Done ✓' : action.status === 'failed' ? 'Failed' : 'Rejected'}
          </span>
        )}
      </div>

      {/* PDF / WhatsApp link */}
      {!!action.payload.pdf && (
        <div className="mt-2 flex items-center gap-2 text-label-sm text-on-surface-variant">
          <a
            href={String(action.payload.pdf)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">description</span>
            View PO PDF
          </a>
          <span>·</span>
          <span>{action.payload.wa_mode === 'simulated' ? 'Simulated WhatsApp' : 'Sent via WhatsApp'}</span>
        </div>
      )}
    </article>
  );
}
