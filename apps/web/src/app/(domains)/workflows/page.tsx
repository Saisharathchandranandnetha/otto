'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorkflowMeta {
  id: string;
  name: string;
  active: boolean;
  updatedAt: string;
  nodeCount?: number;
}

export default function MyWorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<WorkflowMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    fetch('/api/workflows')
      .then((r) => r.json())
      .then((d) => setWorkflows(d.workflows || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const createWorkflow = () => {
    const name = newName.trim();
    if (!name) return;
    const id = 'wf-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    router.push(`/workflows/${id}?name=${encodeURIComponent(name)}`);
  };

  const remove = async (id: string) => {
    await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-display-sm font-semibold text-on-surface">My Workflows</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Build, publish and host your own automation workflows — every published workflow gets a live webhook URL.
          </p>
        </div>
      </div>

      {/* Create new */}
      <div className="flex gap-3 mb-8">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createWorkflow()}
          placeholder="Name your new workflow (e.g. Invoice Approval Bot)"
          className="flex-1 rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          onClick={createWorkflow}
          disabled={!newName.trim() || creating}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary px-6 py-3 text-label-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Workflow
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : workflows.length === 0 ? (
        <div className="border border-dashed border-outline-variant/40 rounded-2xl p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[40px] opacity-40">account_tree</span>
          <p className="mt-2 text-body-md">No workflows yet — create your first one above, or publish a domain template.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <div key={wf.id} className="group rounded-2xl border border-outline-variant/30 bg-surface p-5 hover:shadow-lg hover:border-primary/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-title-md font-semibold text-on-surface truncate">{wf.name}</h3>
                    <p className="text-label-sm text-on-surface-variant">
                      {wf.nodeCount ?? 0} nodes · updated {new Date(wf.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {wf.active ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container rounded-full px-2.5 py-1 uppercase">Draft</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => router.push(`/workflows/${wf.id}?name=${encodeURIComponent(wf.name)}`)}
                  className="flex-1 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface px-3 py-2 text-label-md font-medium transition-colors"
                >
                  Open Editor
                </button>
                {wf.active && (
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/hooks/${wf.id}`)}
                    className="rounded-lg border border-outline-variant/40 hover:bg-surface-container text-on-surface-variant px-3 py-2 text-label-md transition-colors"
                    title="Copy webhook URL"
                  >
                    <span className="material-symbols-outlined text-[18px]">link</span>
                  </button>
                )}
                <button
                  onClick={() => remove(wf.id)}
                  className="rounded-lg border border-error/20 hover:bg-error/5 text-error px-3 py-2 text-label-md transition-colors"
                  title="Delete workflow"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
