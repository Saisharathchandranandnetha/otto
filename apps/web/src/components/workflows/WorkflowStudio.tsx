'use client';

// WorkflowStudio — n8n-style workflow canvas built on React Flow.
// Drag nodes from the palette, connect them, edit in the inspector,
// run a simulated execution, save/load per template (localStorage), export JSON.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ── Node kinds & palette ─────────────────────────────────────────── */

type NodeKind = 'trigger' | 'agent' | 'condition' | 'tool' | 'output';
type RunStatus = 'idle' | 'running' | 'success' | 'error';

const KIND_STYLE: Record<NodeKind, { bar: string; border: string; icon: string; label: string }> = {
  trigger:   { bar: 'bg-amber-500',   border: 'border-amber-400',   icon: 'bolt',          label: 'Trigger' },
  agent:     { bar: 'bg-violet-500',  border: 'border-violet-400',  icon: 'smart_toy',     label: 'AI Agent' },
  condition: { bar: 'bg-sky-500',     border: 'border-sky-400',     icon: 'alt_route',     label: 'Condition' },
  tool:      { bar: 'bg-emerald-500', border: 'border-emerald-400', icon: 'build',         label: 'Tool' },
  output:    { bar: 'bg-rose-500',    border: 'border-rose-400',    icon: 'outbox',        label: 'Output' },
};

const PALETTE: Array<{ kind: NodeKind; label: string; icon: string; desc: string }> = [
  { kind: 'trigger',   label: 'Webhook',        icon: 'webhook',        desc: 'Starts when an HTTP request arrives' },
  { kind: 'trigger',   label: 'Schedule',       icon: 'schedule',       desc: 'Runs on a timed schedule (cron)' },
  { kind: 'trigger',   label: 'Email Received', icon: 'mail',           desc: 'Starts when a new email arrives' },
  { kind: 'agent',     label: 'AI Agent',       icon: 'smart_toy',      desc: 'LLM agent that reasons over the input' },
  { kind: 'agent',     label: 'Extract Data',   icon: 'document_scanner', desc: 'Extract structured fields from documents' },
  { kind: 'agent',     label: 'Classify',       icon: 'category',       desc: 'Classify intent / route the request' },
  { kind: 'agent',     label: 'Generate Doc',   icon: 'description',    desc: 'Generate report, quote or invoice' },
  { kind: 'condition', label: 'Condition',      icon: 'alt_route',      desc: 'Branch on a rule (if / else)' },
  { kind: 'condition', label: 'Human Approval', icon: 'how_to_reg',     desc: 'Wait for a human approve / reject' },
  { kind: 'tool',      label: 'Database',       icon: 'database',       desc: 'Query or update Otto Postgres' },
  { kind: 'tool',      label: 'HTTP Request',   icon: 'public',         desc: 'Call an external REST API' },
  { kind: 'tool',      label: 'WhatsApp',       icon: 'chat',           desc: 'Send a WhatsApp message' },
  { kind: 'tool',      label: 'Slack',          icon: 'tag',            desc: 'Post to a Slack channel' },
  { kind: 'output',    label: 'Send Reply',     icon: 'reply',          desc: 'Reply to the customer / employee' },
  { kind: 'output',    label: 'Update Record',  icon: 'edit_note',      desc: 'Write the result back to the system' },
  { kind: 'output',    label: 'Notify Team',    icon: 'notifications',  desc: 'Alert the responsible team' },
];

/* ── Custom node renderer ─────────────────────────────────────────── */

function StudioNode({ data, selected }: { data: any; selected?: boolean }) {
  const kind: NodeKind = data.kind || 'agent';
  const s = KIND_STYLE[kind];
  const status: RunStatus = data.status || 'idle';

  const ring =
    status === 'running' ? 'ring-2 ring-amber-400 animate-pulse' :
    status === 'success' ? 'ring-2 ring-emerald-400' :
    status === 'error'   ? 'ring-2 ring-rose-500' :
    selected             ? 'ring-2 ring-primary/60' : '';

  return (
    <div className={`bg-white rounded-xl shadow-md border ${s.border} min-w-[190px] max-w-[240px] overflow-hidden ${ring}`}>
      {kind !== 'trigger' && (
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
      )}
      <div className={`${s.bar} text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5`}>
        <span className="material-symbols-outlined text-[14px]">{data.icon || s.icon}</span>
        {s.label}
        {status === 'success' && <span className="material-symbols-outlined text-[14px] ml-auto">check_circle</span>}
        {status === 'running' && <span className="material-symbols-outlined text-[14px] ml-auto animate-spin">progress_activity</span>}
      </div>
      <div className="px-3 py-2">
        <div className="text-[13px] font-semibold text-slate-800 leading-tight">{data.label}</div>
        {data.description && (
          <div className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
    </div>
  );
}

/* ── Starter workflow per template ────────────────────────────────── */

function starterFlow(templateId: string, templateName: string): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 't1', type: 'studio', position: { x: 40, y: 180 },
      data: { kind: 'trigger', icon: 'bolt', label: `${templateName} trigger`, description: 'Incoming event starts this workflow' } },
    { id: 'a1', type: 'studio', position: { x: 320, y: 60 },
      data: { kind: 'agent', icon: 'document_scanner', label: 'Extract & understand', description: 'AI reads the incoming data and extracts structured fields' } },
    { id: 'a2', type: 'studio', position: { x: 320, y: 300 },
      data: { kind: 'agent', icon: 'smart_toy', label: `${templateName} agent`, description: 'Domain agent decides the next best action' } },
    { id: 'c1', type: 'studio', position: { x: 620, y: 180 },
      data: { kind: 'condition', icon: 'how_to_reg', label: 'Trust gate', description: 'Auto-approve if confidence > 90%, else human approval' } },
    { id: 'o1', type: 'studio', position: { x: 900, y: 80 },
      data: { kind: 'output', icon: 'reply', label: 'Execute & reply', description: 'Perform the action and reply instantly' } },
    { id: 'o2', type: 'studio', position: { x: 900, y: 300 },
      data: { kind: 'output', icon: 'notifications', label: 'Escalate to team', description: 'Route to a human with full AI context' } },
  ];
  const edges: Edge[] = [
    { id: 'e1', source: 't1', target: 'a1', animated: true },
    { id: 'e2', source: 't1', target: 'a2', animated: true },
    { id: 'e3', source: 'a1', target: 'c1', animated: true },
    { id: 'e4', source: 'a2', target: 'c1', animated: true },
    { id: 'e5', source: 'c1', target: 'o1', animated: true, label: 'approved' },
    { id: 'e6', source: 'c1', target: 'o2', animated: true, label: 'needs review' },
  ];
  return { nodes, edges };
}

const storageKey = (templateId: string) => `otto-workflow-${templateId}`;

/* ── Canvas (needs ReactFlowProvider parent) ──────────────────────── */

function StudioCanvas({ templateId, templateName }: { templateId: string; templateName: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const idCounter = useRef(100);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({ studio: StudioNode }), []);

  // Load workflow when template changes: published server copy → local save → starter
  useEffect(() => {
    let cancelled = false;
    setPublished(false);
    setRunLog([]);

    const loadLocal = () => {
      try {
        const raw = localStorage.getItem(storageKey(templateId));
        if (raw) {
          const parsed = JSON.parse(raw);
          setNodes(parsed.nodes || []);
          setEdges(parsed.edges || []);
          return true;
        }
      } catch { /* corrupted save — fall through to starter */ }
      return false;
    };

    fetch(`/api/workflows/${templateId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.workflow) {
          setNodes(data.workflow.nodes || []);
          setEdges(data.workflow.edges || []);
          setPublished(!!data.workflow.active);
        } else if (!loadLocal()) {
          const starter = starterFlow(templateId, templateName);
          setNodes(starter.nodes);
          setEdges(starter.edges);
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (!loadLocal()) {
          const starter = starterFlow(templateId, templateName);
          setNodes(starter.nodes);
          setEdges(starter.edges);
        }
      });

    return () => { cancelled = true; };
  }, [templateId, templateName, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const addNode = useCallback((item: typeof PALETTE[number], position?: { x: number; y: number }) => {
    const id = `n${idCounter.current++}-${Date.now() % 10000}`;
    const pos = position || { x: 300 + Math.random() * 120, y: 140 + Math.random() * 120 };
    setNodes((nds) => nds.concat({
      id, type: 'studio', position: pos,
      data: { kind: item.kind, icon: item.icon, label: item.label, description: item.desc },
    }));
  }, [setNodes]);

  // Drag & drop from palette
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/otto-node');
    if (!raw) return;
    const item = JSON.parse(raw) as typeof PALETTE[number];
    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addNode(item, pos);
  }, [addNode, screenToFlowPosition]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /* ── Save / export ── */
  const save = useCallback(() => {
    const clean = nodes.map((n) => ({ ...n, data: { ...n.data, status: undefined } }));
    localStorage.setItem(storageKey(templateId), JSON.stringify({ nodes: clean, edges }));
    setSavedAt(new Date().toLocaleTimeString());
  }, [nodes, edges, templateId]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ template: templateId, nodes, edges }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateId}-workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [templateId, nodes, edges]);

  // Publish = host the workflow server-side and expose a live webhook URL
  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      const clean = nodes.map((n) => ({ ...n, data: { ...n.data, status: undefined } }));
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateId, name: templateName, nodes: clean, edges, active: !published }),
      });
      if (res.ok) {
        setPublished(!published);
        setSavedAt(new Date().toLocaleTimeString());
      }
    } finally {
      setPublishing(false);
    }
  }, [nodes, edges, templateId, templateName, published]);

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/hooks/${templateId}` : '';
  const copyWebhook = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [webhookUrl]);

  const resetToStarter = useCallback(() => {
    localStorage.removeItem(storageKey(templateId));
    const starter = starterFlow(templateId, templateName);
    setNodes(starter.nodes);
    setEdges(starter.edges);
    setRunLog([]);
  }, [templateId, templateName, setNodes, setEdges]);

  /* ── Simulated execution (BFS from triggers) ── */
  const setStatus = useCallback((ids: string[], status: RunStatus) => {
    setNodes((nds) => nds.map((n) => ids.includes(n.id) ? { ...n, data: { ...n.data, status } } : n));
  }, [setNodes]);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setRunLog([`▶ Run started — ${new Date().toLocaleTimeString()}`]);
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));

    // Build execution levels from trigger nodes outward
    const incoming = new Map<string, number>();
    nodes.forEach((n) => incoming.set(n.id, 0));
    edges.forEach((e) => incoming.set(e.target, (incoming.get(e.target) || 0) + 1));
    let frontier = nodes.filter((n) => (n.data as any).kind === 'trigger' || incoming.get(n.id) === 0).map((n) => n.id);
    const done = new Set<string>();
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    while (frontier.length > 0) {
      setStatus(frontier, 'running');
      await sleep(650);
      setStatus(frontier, 'success');
      frontier.forEach((id) => {
        const label = (nodes.find((n) => n.id === id)?.data as any)?.label || id;
        const ms = 180 + Math.floor(Math.random() * 600);
        setRunLog((log) => [...log, `✓ ${label} completed in ${ms}ms`]);
        done.add(id);
      });
      const next = new Set<string>();
      edges.forEach((e) => {
        if (done.has(e.source) && !done.has(e.target)) {
          // ready when every parent is done
          const parents = edges.filter((x) => x.target === e.target).map((x) => x.source);
          if (parents.every((p) => done.has(p))) next.add(e.target);
        }
      });
      frontier = Array.from(next);
    }

    setRunLog((log) => [...log, `■ Run finished — ${done.size} nodes executed successfully`]);
    setRunning(false);
  }, [running, nodes, edges, setNodes, setStatus]);

  /* ── Inspector ── */
  const selected = nodes.find((n) => n.id === selectedId);
  const updateSelected = useCallback((field: 'label' | 'description', value: string) => {
    if (!selectedId) return;
    setNodes((nds) => nds.map((n) => n.id === selectedId ? { ...n, data: { ...n.data, [field]: value } } : n));
  }, [selectedId, setNodes]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges]);

  return (
    <div className="flex-1 flex min-h-0">
      {/* Node palette */}
      {paletteOpen && (
        <div className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
          <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Nodes</span>
            <span className="text-[10px] text-slate-400">drag onto canvas</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {PALETTE.map((item) => {
              const s = KIND_STYLE[item.kind];
              return (
                <div
                  key={`${item.kind}-${item.label}`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('application/otto-node', JSON.stringify(item))}
                  onClick={() => addNode(item)}
                  title={item.desc}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm cursor-grab active:cursor-grabbing bg-white transition-all"
                >
                  <span className={`w-6 h-6 rounded-md ${s.bar} text-white flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  </span>
                  <span className="text-[12px] font-medium text-slate-700">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Canvas + toolbar + run log */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white shrink-0">
          <button onClick={() => setPaletteOpen((o) => !o)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Toggle node palette">
            <span className="material-symbols-outlined text-[18px]">left_panel_close</span>
          </button>
          <button onClick={run} disabled={running}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-1.5 text-[12px] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[16px]">{running ? 'progress_activity' : 'play_arrow'}</span>
            {running ? 'Running…' : 'Run Workflow'}
          </button>
          <button onClick={save}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-1.5 text-[12px] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[16px]">save</span> Save
          </button>
          <button onClick={publish} disabled={publishing}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50 ${
              published
                ? 'bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-900 hover:bg-slate-700 text-white'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{published ? 'cloud_done' : 'cloud_upload'}</span>
            {publishing ? 'Publishing…' : published ? 'Published' : 'Publish'}
          </button>
          <button onClick={exportJson}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-[12px] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span> Export
          </button>
          <button onClick={resetToStarter}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400 px-3 py-1.5 text-[12px] font-medium transition-colors">
            <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
          </button>
          {savedAt && <span className="text-[11px] text-emerald-600 ml-auto">Saved {savedAt}</span>}
        </div>

        {/* Live webhook URL — shown once the workflow is hosted */}
        {published && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-emerald-200 bg-emerald-50 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live
            </span>
            <code className="text-[11px] text-emerald-800 bg-white border border-emerald-200 rounded px-2 py-0.5 truncate">{webhookUrl}</code>
            <button onClick={copyWebhook} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900">
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <span className="text-[10px] text-emerald-600/70 ml-auto hidden md:block">POST this URL to trigger the workflow</span>
          </div>
        )}

        <div className="flex-1 min-h-0" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, n) => setSelectedId(n.id)}
            onPaneClick={() => setSelectedId(null)}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
            className="bg-slate-50"
          >
            <Controls />
            <MiniMap pannable zoomable className="!bg-white" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} color="#cbd5e1" />
          </ReactFlow>
        </div>

        {runLog.length > 0 && (
          <div className="h-32 shrink-0 border-t border-slate-200 bg-slate-900 text-slate-200 font-mono text-[11px] p-3 overflow-y-auto">
            {runLog.map((line, i) => (
              <div key={i} className={line.startsWith('✓') ? 'text-emerald-400' : line.startsWith('▶') ? 'text-amber-400' : 'text-slate-300'}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspector */}
      {selected && (
        <div className="w-64 shrink-0 border-l border-slate-200 bg-white flex flex-col">
          <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Node Settings</span>
            <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Type</label>
              <div className="text-[13px] font-medium text-slate-800 mt-0.5">
                {KIND_STYLE[((selected.data as any).kind as NodeKind) || 'agent'].label}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Name</label>
              <input
                value={(selected.data as any).label || ''}
                onChange={(e) => updateSelected('label', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Description</label>
              <textarea
                value={(selected.data as any).description || ''}
                onChange={(e) => updateSelected('description', e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
            <button onClick={deleteSelected}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-2 text-[12px] font-semibold transition-colors">
              <span className="material-symbols-outlined text-[16px]">delete</span> Delete Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Public component ─────────────────────────────────────────────── */

export function WorkflowStudio({ templateId, templateName }: { templateId: string; templateName: string }) {
  return (
    <ReactFlowProvider>
      <StudioCanvas templateId={templateId} templateName={templateName} />
    </ReactFlowProvider>
  );
}
