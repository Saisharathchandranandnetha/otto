'use client';
// FLOW 0 — the opening wow. Blank Otto + a pile of documents → a running business.
// Redesigned with Stitch M3 onboarding layout: clean top bar, bento doc grid,
// vertical stepper, and sticky bottom action bar.
import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useOtto } from '@/components/useOtto';
import { ResurrectionProgress } from '@/components/ResurrectionProgress';
import { ApprovalCard } from '@/components/ApprovalCard';
import { AppShell } from '@/components/AppShell';

function DropZone({ files, onChange, disabled }: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) onChange(dropped);
  }, [onChange]);

  return (
    <label
      className={`relative block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors duration-300 ${
        dragging
          ? 'border-primary bg-primary/5'
          : files.length > 0
            ? 'border-secondary/50 bg-secondary/5'
            : 'border-outline-variant hover:border-primary/40 bg-surface-container-lowest'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        hidden
        accept="image/*,.svg,.txt"
        disabled={disabled}
        onChange={(e) => {
          const fileList = e.target.files;
          if (fileList && fileList.length > 0) onChange(Array.from(fileList));
        }}
      />
      <div className="empty-box mx-auto" aria-hidden="true" />

      <p className="mt-4 text-headline-sm text-on-surface">
        {files.length > 0
          ? `${files.length} document${files.length !== 1 ? 's' : ''} ready`
          : 'Drop the shoebox here'}
      </p>
      <p className="mt-2 text-body-md text-on-surface-variant max-w-sm mx-auto">
        {files.length > 0
          ? 'Tap to add more, or clear selection below.'
          : 'Photos of invoices, ledger pages, and your WhatsApp chat export (.txt)'}
      </p>
      
      {/* Bento grid preview of selected files */}
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          {files.slice(0, 5).map((f, i) => (
            <div key={i} className="bg-surface p-2 rounded-lg border border-outline-variant/30 flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">
                {f.name.endsWith('.txt') ? 'chat' : 'description'}
              </span>
              <span className="text-label-sm text-on-surface truncate">{f.name}</span>
            </div>
          ))}
          {files.length > 5 && (
            <div className="bg-surface-container-high p-2 rounded-lg flex items-center justify-center">
              <span className="text-label-sm text-on-surface-variant">+{files.length - 5} more</span>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <button
          type="button"
          className="btn-ghost mt-6 text-label-sm h-8 px-4"
          onClick={(e) => { e.preventDefault(); onChange([]); }}
        >
          Clear selection
        </button>
      )}
    </label>
  );
}

export default function ResurrectionPage() {
  const { actions, events, act } = useOtto();
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summaryCard = useMemo(
    () => actions.find((a) => a.type === 'resurrection_commit'),
    [actions],
  );

  const start = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const form = new FormData();
      for (const f of files) form.append('files', f);
      form.append('mode', 'resurrection');
      const res = await fetch('/api/ingest', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          (body as { error?: string }).error ??
          'Something went wrong — check the activity trace for details.',
        );
      }
    } catch {
      setError('Network error — check your connection.');
    } finally {
      setRunning(false);
    }
  }, [files]);

  const done = summaryCard?.status === 'executed';

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl px-container-padding py-stack-md flex flex-col gap-stack-lg">
        {/* Header with back button */}
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-label-lg text-on-surface-variant hover:text-primary transition-colors w-fit -ml-2 p-2 rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </Link>
          <div>
            <h1 className="text-headline-lg text-primary">
              Building your business
            </h1>
            <p className="mt-2 text-body-lg text-on-surface-variant max-w-lg">
              Drop in your invoices and chat history. Otto reads everything and rebuilds your whole business in minutes. Zero typing.
            </p>
          </div>
        </header>

        {/* Upload Zone */}
        {!summaryCard && (
          <section className="space-y-4">
            <DropZone files={files} onChange={setFiles} disabled={running} />
            
            {error && (
              <div className="card border-error/40 bg-error/5" role="alert">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-error mt-0.5 shrink-0">error</span>
                  <p className="text-body-md text-error">{error}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* The narrated build (Stepper) */}
        <ResurrectionProgress events={events} running={running} />

        {/* Summary card (Final approval) */}
        {summaryCard && (
          <section className="space-y-4 fade-in-up">
            <ApprovalCard action={summaryCard} onAct={act} />
            {done && (
              <div className="flex justify-center mt-8">
                <Link href="/" className="btn-primary px-8">
                  Open your business
                  <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                </Link>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Sticky Bottom Action Bar (Only visible when ready to start and not finished) */}
      {!summaryCard && files.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-container-padding bg-surface-container-lowest border-t border-surface-container-highest shadow-[0_-8px_24px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-label-lg text-on-surface">{files.length} documents ready</p>
              <p className="text-label-sm text-on-surface-variant">Tap to begin processing</p>
            </div>
            <button
              className={`btn-primary w-full sm:w-auto ${running ? 'shimmer relative overflow-hidden text-transparent' : ''}`}
              disabled={running}
              onClick={() => void start()}
            >
              {running ? (
                <span className="absolute inset-0 flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                  Extracting...
                </span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">magic_button</span>
                  Resurrect Business
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
