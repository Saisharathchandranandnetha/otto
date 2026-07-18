// Live webhook endpoint for published workflows — the "hosted" URL.
// POST (or GET) /api/hooks/{workflowId} executes the workflow server-side
// and returns the run trace, like triggering a production n8n webhook.
import { NextRequest, NextResponse } from 'next/server';
import { getWorkflow, executeWorkflow } from '@/lib/workflow-store';

async function trigger(req: NextRequest, id: string) {
  const wf = await getWorkflow(id);
  if (!wf) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  if (!wf.active) return NextResponse.json({ error: 'Workflow is not published' }, { status: 403 });

  let input: unknown = null;
  try { input = await req.json(); } catch { /* no body */ }

  return NextResponse.json(executeWorkflow(wf, input));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return trigger(req, id);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return trigger(req, id);
}
