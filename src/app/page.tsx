'use client';
// The Approval Feed — Otto's home screen. Mobile-first single-column feed
// with a trust meter strip at top and a camera FAB for invoice scanning.
// Sidebar content (trace, WhatsApp) moved to expandable drawers and settings.
import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useOtto, inr } from '@/components/useOtto';
import { ApprovalCard } from '@/components/ApprovalCard';
import { TrustMeter } from '@/components/TrustMeter';
import { ActivityTrace } from '@/components/ActivityTrace';
import { SimulatedWhatsAppPane } from '@/components/SimulatedWhatsAppPane';
import { AppShell } from '@/components/AppShell';
import { DomainEnginePanel } from '@/components/DomainEnginePanel';

function EmptyState() {
  return (
    <div className="card my-8 text-center">
      <div className="empty-box mx-auto" aria-hidden="true" />
      <p className="mt-6 text-headline-sm text-on-surface">Otto is blank</p>
      <p className="mt-1 text-body-md text-on-surface-variant">
        Like every small business on day one — just a shoebox of papers and a phone full of WhatsApp messages.
      </p>
      <p className="mt-4 text-body-md text-on-surface-variant">
        Drop your shoebox in and Otto will rebuild your entire business from what&apos;s already there.
      </p>
      <Link href="/resurrection" className="btn-primary mt-6 inline-flex gap-2">
        Start the resurrection
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading feed" role="status">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="mb-3 h-4 w-2/3 rounded bg-surface-container-highest" />
          <div className="mb-2 h-3 w-full rounded bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { actions, grants, counts, events, connected, act, revoke, refresh } = useOtto();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrace, setShowTrace] = useState(false);

  const uploadInvoice = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('files', file);
      form.append('mode', 'single');
      const res = await fetch('/api/ingest', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? 'Extraction failed — try a clearer photo.');
      }
      await refresh();
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setUploading(false);
    }
  }, [refresh]);

  const loading = counts === null;
  const empty = !loading && counts!.products === 0 && actions.length <= 2;
  const pendingCount = actions.filter((a) => a.status === 'awaiting_approval').length;

  return (
    <AppShell>
      <DomainEnginePanel onRefresh={refresh} />

      {/* Trust Meter Strip */}
      {grants.length > 0 && (
        <section className="px-container-padding py-base bg-surface-container-lowest border-b border-surface-container-highest shadow-sm">
          <TrustMeter grants={grants} onRevoke={revoke} />
        </section>
      )}

      {/* Main Feed */}
      <main className="flex-1 overflow-y-auto px-container-padding py-stack-md flex flex-col gap-stack-md max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-end">
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Approval Queue
          </h1>
          {pendingCount > 0 && (
            <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
              {pendingCount} Pending
            </span>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="card border-error/40" role="alert">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5 shrink-0">error</span>
              <div className="flex-1">
                <p className="text-body-md text-error">{error}</p>
                <button
                  className="btn-ghost mt-2 text-label-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Try again
                </button>
              </div>
              <button
                className="shrink-0 text-on-surface-variant hover:text-on-surface"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Feed Cards */}
        {loading && <LoadingSkeleton />}
        {empty && <EmptyState />}
        {!loading && !empty && actions.length === 0 ? (
          <p className="py-12 text-center text-body-md text-on-surface-variant">
            No actions yet — snap an invoice or start the resurrection.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {actions.map((a) => (
              <ApprovalCard key={a.id} action={a} onAct={act} />
            ))}
          </div>
        )}

        {/* Activity Trace (collapsible) */}
        {events.length > 0 && (
          <div className="mt-4">
            <button
              className="flex items-center gap-2 text-label-lg text-on-surface-variant hover:text-on-surface transition-colors w-full"
              onClick={() => setShowTrace(!showTrace)}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showTrace ? 'expand_less' : 'expand_more'}
              </span>
              Agent Activity
              <span className={`ml-auto live-dot ${connected ? 'live-dot--on' : 'live-dot--off'}`} />
            </button>
            {showTrace && (
              <div className="mt-3 space-y-3">
                <ActivityTrace events={events} />
                <SimulatedWhatsAppPane events={events} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Camera FAB */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.svg"
        capture="environment"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadInvoice(file);
          e.target.value = '';
        }}
      />
      <button
        className="fixed bottom-[96px] right-container-padding w-14 h-14
                   bg-primary text-on-primary rounded-2xl shadow-lg
                   flex items-center justify-center
                   hover:scale-105 transition-transform z-40 active:scale-95
                   md:bottom-8"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        aria-label="Snap invoice"
      >
        {uploading ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            photo_camera
          </span>
        )}
      </button>
    </AppShell>
  );
}
