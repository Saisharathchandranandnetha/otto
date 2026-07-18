// File-based workflow storage — lets users publish ("host") workflows without a DB.
// Stored as JSON under apps/web/.workflows/, one file per workflow.
import { promises as fs } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), '.workflows');

export interface StoredWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  edges: any[];
  updatedAt: string;
}

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

function fileFor(id: string) {
  // Sanitize: allow only slug-safe characters to prevent path traversal
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safe) throw new Error('Invalid workflow id');
  return path.join(DIR, `${safe}.json`);
}

export async function listWorkflows(): Promise<Omit<StoredWorkflow, 'nodes' | 'edges'>[]> {
  await ensureDir();
  const files = await fs.readdir(DIR);
  const out = [];
  for (const f of files.filter((f) => f.endsWith('.json'))) {
    try {
      const wf = JSON.parse(await fs.readFile(path.join(DIR, f), 'utf8')) as StoredWorkflow;
      out.push({ id: wf.id, name: wf.name, active: wf.active, updatedAt: wf.updatedAt, nodeCount: wf.nodes?.length ?? 0 } as any);
    } catch { /* skip corrupted file */ }
  }
  return out.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

export async function getWorkflow(id: string): Promise<StoredWorkflow | null> {
  await ensureDir();
  try {
    return JSON.parse(await fs.readFile(fileFor(id), 'utf8'));
  } catch {
    return null;
  }
}

export async function saveWorkflow(wf: Omit<StoredWorkflow, 'updatedAt'>): Promise<StoredWorkflow> {
  await ensureDir();
  const stored: StoredWorkflow = { ...wf, updatedAt: new Date().toISOString() };
  await fs.writeFile(fileFor(wf.id), JSON.stringify(stored, null, 2), 'utf8');
  return stored;
}

export async function deleteWorkflow(id: string): Promise<void> {
  try { await fs.unlink(fileFor(id)); } catch { /* already gone */ }
}

/** Server-side simulated execution: walk the graph from triggers, return a run trace. */
export function executeWorkflow(wf: StoredWorkflow, input: unknown) {
  const incoming = new Map<string, number>();
  wf.nodes.forEach((n) => incoming.set(n.id, 0));
  wf.edges.forEach((e) => incoming.set(e.target, (incoming.get(e.target) || 0) + 1));

  const done = new Set<string>();
  const steps: Array<{ nodeId: string; label: string; kind: string; status: string; durationMs: number }> = [];
  let frontier = wf.nodes.filter((n) => n.data?.kind === 'trigger' || incoming.get(n.id) === 0).map((n) => n.id);

  while (frontier.length > 0) {
    for (const id of frontier) {
      const node = wf.nodes.find((n) => n.id === id);
      steps.push({
        nodeId: id,
        label: node?.data?.label || id,
        kind: node?.data?.kind || 'agent',
        status: 'success',
        durationMs: 120 + Math.floor(Math.random() * 700),
      });
      done.add(id);
    }
    const next = new Set<string>();
    wf.edges.forEach((e) => {
      if (done.has(e.source) && !done.has(e.target)) {
        const parents = wf.edges.filter((x) => x.target === e.target).map((x) => x.source);
        if (parents.every((p) => done.has(p))) next.add(e.target);
      }
    });
    frontier = Array.from(next);
  }

  return {
    runId: `run_${Date.now().toString(36)}`,
    workflowId: wf.id,
    workflowName: wf.name,
    status: 'success' as const,
    input: input ?? null,
    executedNodes: steps.length,
    totalDurationMs: steps.reduce((s, x) => s + x.durationMs, 0),
    steps,
    finishedAt: new Date().toISOString(),
  };
}
