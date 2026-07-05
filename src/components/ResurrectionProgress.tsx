'use client';
// The live narrated build: mapped to a vertical stepper matching Stitch onboarding.
// We extract specific milestones from the narration lines to drive the stepper.
// The raw log is hidden behind an "Advanced view" toggle if needed.
import { useMemo, useState } from 'react';
import type { OttoEvent } from './useOtto';

const STEPS = [
  { id: 'extract', label: 'Extracting data', regex: /Extracted \d+ entities/i },
  { id: 'validate', label: 'Validating against schema', regex: /Validated against Zod schemas/i },
  { id: 'build', label: 'Building knowledge graph', regex: /Building knowledge graph/i },
  { id: 'finalize', label: 'Finalizing state', regex: /Found \d+ products/i },
];

export function ResurrectionProgress({
  events,
  running,
}: {
  events: OttoEvent[];
  running: boolean;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const narrationLines = useMemo(
    () => events.filter((e) => e.toState === 'narration'),
    [events],
  );

  // Determine current step index based on regex matches in the stream
  let currentStepIdx = 0;
  if (narrationLines.length > 0) {
    STEPS.forEach((step, i) => {
      if (narrationLines.some((l) => step.regex.test(String(l.detail?.line ?? '')))) {
        currentStepIdx = i + 1; // Completed this step
      }
    });
  }

  // Cap at max steps
  currentStepIdx = Math.min(currentStepIdx, STEPS.length - 1);
  if (!running && narrationLines.length > 0) currentStepIdx = STEPS.length; // All done

  const isActive = running || narrationLines.length > 0;

  if (!isActive) return null;

  return (
    <div className="card space-y-4">
      <h2 className="text-label-lg text-on-surface font-semibold mb-4">Rebuilding your business</h2>

      {/* Vertical Stepper */}
      <div className="relative pl-4 border-l-2 border-surface-container-highest space-y-6">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx && running;
          const isPending = idx > currentStepIdx;

          return (
            <div key={step.id} className="relative fade-in-up">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500
                  ${isCompleted ? 'bg-secondary text-on-secondary'
                  : isCurrent ? 'bg-primary text-on-primary animate-pulse'
                  : 'bg-surface-container-highest text-on-surface-variant'}`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : isCurrent ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                ) : (
                  <span className="text-[12px]">{idx + 1}</span>
                )}
              </div>

              {/* Step label */}
              <div>
                <p className={`text-body-md transition-colors duration-500 ${
                  isCompleted ? 'text-on-surface'
                  : isCurrent ? 'text-primary font-semibold'
                  : 'text-on-surface-variant opacity-60'
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-label-sm text-on-surface-variant mt-1 animate-pulse">
                    Processing documents...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced toggle */}
      <div className="pt-4 border-t border-surface-container-highest">
        <button
          className="text-label-sm text-primary hover:underline flex items-center gap-1"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="material-symbols-outlined text-[16px]">
            {showAdvanced ? 'expand_less' : 'expand_more'}
          </span>
          {showAdvanced ? 'Hide advanced log' : 'Show advanced log'}
        </button>

        {/* Raw narration log (hidden by default) */}
        {showAdvanced && (
          <div className="mt-4 max-h-60 overflow-y-auto font-mono text-[11px] leading-6 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
            {narrationLines.map((l, i) => (
              <p
                key={l.id ?? `narration-${i}`}
                className="animate-tick-up flex items-start gap-2"
              >
                <span className="shrink-0 text-primary">▸</span>
                <span className={String(l.detail.line ?? '').startsWith('📊') ? 'text-on-surface' : 'text-on-surface-variant'}>
                  {String(l.detail.line ?? '')}
                </span>
              </p>
            ))}
            {running && (
              <p className="flex animate-pulse items-start gap-2 text-on-surface-variant/60">
                <span>▸</span>
                <span>Processing…</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
