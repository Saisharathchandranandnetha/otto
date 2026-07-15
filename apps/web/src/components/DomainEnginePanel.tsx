'use client';

import { useState } from 'react';
import {
  THEME2_PLAYBOOKS,
  type Theme2DomainSlug,
  type Theme2Playbook,
} from '@/lib/theme2';

interface Props {
  onRefresh: () => Promise<void>;
}

function playbookBySlug(slug: Theme2DomainSlug): Theme2Playbook {
  return THEME2_PLAYBOOKS.find((playbook) => playbook.slug === slug) ?? THEME2_PLAYBOOKS[0]!;
}

export function DomainEnginePanel({ onRefresh }: Props) {
  const [activeSlug, setActiveSlug] = useState<Theme2DomainSlug>('education');
  const [busy, setBusy] = useState<Theme2DomainSlug | 'all' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const active = playbookBySlug(activeSlug);

  async function run(payload: { run_domain?: Theme2DomainSlug; run_theme2_all?: boolean }) {
    setBusy(payload.run_theme2_all ? 'all' : payload.run_domain ?? null);
    setError(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; mocked?: boolean };
      if (!res.ok) {
        throw new Error(body.error ?? 'Domain agent failed');
      }
      if (body.mocked) {
        window.dispatchEvent(new CustomEvent('otto-mock-stage-all', { detail: payload }));
      }
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Domain agent failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="border-b border-outline-variant/50 bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-container-padding py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#111827] px-2 py-1 text-label-sm font-semibold text-white">
                Theme 2
              </span>
              <span className="rounded border border-outline-variant/50 bg-white px-2 py-1 text-label-sm text-on-surface-variant">
                Otto-powered orchestration
              </span>
              <span className="rounded border border-outline-variant/50 bg-white px-2 py-1 text-label-sm text-on-surface-variant">
                Human gate active
              </span>
            </div>
            <h1 className="mt-3 text-[26px] font-bold leading-8 text-on-surface md:text-[32px] md:leading-10">
              Autonomous Workflow Agents
            </h1>
            <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
              One safety core, eight industries, five reusable AI action families.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:w-[360px]">
            {[
              ['8', 'domains'],
              ['5', 'actions'],
              ['1', 'gate'],
            ].map(([value, label]) => (
              <div key={label} className="rounded border border-outline-variant/50 bg-white px-3 py-2">
                <p className="text-headline-sm text-on-surface">{value}</p>
                <p className="text-label-sm text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded border border-error/30 bg-error/5 px-3 py-2 text-label-sm text-error">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {THEME2_PLAYBOOKS.map((playbook) => {
              const activeDomain = playbook.slug === active.slug;
              return (
                <button
                  key={playbook.slug}
                  type="button"
                  onClick={() => setActiveSlug(playbook.slug)}
                  className={`group rounded border bg-white p-3 text-left transition ${
                    activeDomain
                      ? 'border-on-surface shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
                      : 'border-outline-variant/50 hover:border-on-surface-variant/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
                      style={{ backgroundColor: playbook.accent, color: playbook.color }}
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {playbook.icon}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label-lg text-on-surface">
                        {playbook.industry}
                      </span>
                      <span className="block truncate text-label-sm text-on-surface-variant">
                        {playbook.actionType.replace(/_/g, ' ')}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded border border-outline-variant/50 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded"
                    style={{ backgroundColor: active.accent, color: active.color }}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {active.icon}
                    </span>
                  </span>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{active.operator}</p>
                    <h2 className="text-headline-sm text-on-surface">{active.title}</h2>
                  </div>
                </div>
                <p className="mt-3 max-w-3xl text-body-md text-on-surface-variant">
                  {active.reasoning}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-ghost whitespace-nowrap"
                  disabled={busy !== null}
                  onClick={() => void run({ run_theme2_all: true })}
                >
                  <span className="material-symbols-outlined text-[18px]">select_all</span>
                  {busy === 'all' ? 'Staging...' : 'Stage all'}
                </button>
                <button
                  className="btn-secondary whitespace-nowrap"
                  disabled={busy !== null}
                  onClick={() => void run({ run_domain: active.slug })}
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  {busy === active.slug ? 'Staging...' : 'Stage'}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[active.impact.primary, active.impact.secondary, active.impact.costOfDelay].map((item) => (
                <div key={item} className="rounded border border-outline-variant/50 bg-[#f8fafc] p-3">
                  <p className="text-label-sm text-on-surface">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded border border-outline-variant/50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-label-lg text-on-surface">Workflow</p>
                  <span className="rounded bg-surface-container px-2 py-1 text-label-sm text-on-surface-variant">
                    {active.approvalChain.join(' + ')}
                  </span>
                </div>
                <ol className="grid gap-2">
                  {active.workflow.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 rounded bg-surface-container-low px-3 py-2">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-label-sm font-semibold"
                        style={{ backgroundColor: active.accent, color: active.color }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-label-sm text-on-surface">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded border border-outline-variant/50 p-3">
                <p className="text-label-lg text-on-surface">Draft</p>
                <div className="mt-3 rounded bg-surface-container-low p-3">
                  <p className="text-label-sm font-semibold text-on-surface">
                    {active.draft.format}
                  </p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">
                    {active.draft.recipient}
                  </p>
                  <p className="mt-3 text-body-md text-on-surface">
                    {active.draft.body}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.sources.map((source) => (
                    <span key={source} className="rounded border border-outline-variant/50 px-2 py-1 text-label-sm text-on-surface-variant">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
