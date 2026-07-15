'use client';
// One hook owns all live state: initial snapshot from /api/feed, live updates via
// /api/events (EventSource with cursor resume — reconnects never miss an event).
import { useCallback, useEffect, useRef, useState } from 'react';

export interface FeedAction {
  id: string;
  type: string;
  status: string;
  payload: Record<string, unknown>;
  reasoning: string | null;
  amount: number | null;
  approvedBy: string | null;
  trustGrantId: string | null;
  undoDeadline: string | null;
  createdAt: string;
}

export interface Grant {
  actionType: string;
  approvalsCount: number;
  autonomyLevel: 'gated' | 'autonomous';
  amountCap: number | null;
  revokedAt: string | null;
  offeredAt: string | null;
  grantedAt: string | null;
}

export interface Counts {
  products: number;
  suppliers: number;
  customers: number;
  dues: number;
  lowStock: number;
}

export interface OttoEvent {
  id?: number;
  actionId: string | null;
  fromState: string | null;
  toState: string;
  detail: Record<string, unknown>;
  createdAt?: string;
  actionType?: string;
}

export function useOtto() {
  const [actions, setActions] = useState<FeedAction[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [events, setEvents] = useState<OttoEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const cursor = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/feed', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!res.ok) return;
      const data = (await res.json()) as {
        actions: FeedAction[];
        grants: Grant[];
        counts: Counts;
        lastEventId: number;
      };
      if (!mounted.current) return;
      setActions(data.actions);
      setGrants(data.grants);
      setCounts(data.counts);
    } catch {
      // silent — connection will retry via SSE
    }
  }, []);

  useEffect(() => {
    const handleMockStageAll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const { THEME2_PLAYBOOKS } = require('@/lib/theme2');
      
      const newActions = THEME2_PLAYBOOKS
        .filter((p: any) => detail.run_theme2_all || p.slug === detail.run_domain)
        .map((playbook: any, idx: number) => ({
          id: `mock-${Date.now()}-${idx}`,
          type: playbook.actionType,
          status: 'awaiting_approval',
          payload: {
            domain: playbook.slug,
            domain_name: playbook.industry,
            icon: playbook.icon,
            color: playbook.color,
            accent: playbook.accent,
            problem_statement: playbook.problemStatement,
            title: playbook.title,
            owner: playbook.owner,
            signal: playbook.signal,
            operator: playbook.operator,
            workflow_steps: playbook.workflow,
            approval_chain: playbook.approvalChain,
            draft: playbook.draft,
            impact: playbook.impact,
            sources: playbook.sources,
            confidence: playbook.confidence,
            engine: { mode: 'mock', status: 'succeeded' }
          },
          reasoning: playbook.reasoning,
          amount: playbook.amountInr,
          approvedBy: null,
          trustGrantId: null,
          undoDeadline: null,
          createdAt: new Date().toISOString(),
        }));
      setActions(prev => [...newActions, ...prev]);
    };

    window.addEventListener('otto-mock-stage-all', handleMockStageAll);
    return () => window.removeEventListener('otto-mock-stage-all', handleMockStageAll);
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();

    const es = new EventSource(`/api/events`);

    es.onopen = () => {
      if (mounted.current) setConnected(true);
    };

    es.onerror = () => {
      if (mounted.current) setConnected(false);
    };

    es.onmessage = (msg) => {
      try {
        const e = JSON.parse(msg.data as string) as OttoEvent & { id?: number; createdAt?: string };
        if (!mounted.current) return;
        if (e.id) cursor.current = Math.max(cursor.current, e.id);
        setEvents((prev) => [...prev.slice(-500), e]);

        // Debounced feed refresh — 500ms after last event
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => void refresh(), 500);
      } catch {
        // malformed SSE data — skip
      }
    };

    return () => {
      mounted.current = false;
      es.close();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [refresh]);

  const act = useCallback(
    async (actionId: string, decision: 'approve' | 'reject' | 'undo', capInr?: number) => {
      if (actionId.startsWith('mock-')) {
        setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: decision === 'approve' ? 'executed' : 'rejected' } : a));
        return Promise.resolve({ ok: true, mocked: true });
      }

      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, decision, capInr }),
      });
      await refresh();
      return res.json() as Promise<Record<string, unknown>>;
    },
    [refresh],
  );

  const revoke = useCallback(
    async (actionType: string) => {
      await fetch('/api/trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revoke: actionType }),
      });
      await refresh();
    },
    [refresh],
  );

  return { actions, grants, counts, events, connected, act, revoke, refresh };
}

export const inr = (n: number | null | undefined) =>
  n == null ? '—' : new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
