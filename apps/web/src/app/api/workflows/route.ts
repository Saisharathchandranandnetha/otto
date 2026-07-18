import { NextRequest, NextResponse } from 'next/server';
import { listWorkflows, saveWorkflow } from '@/lib/workflow-store';

export async function GET() {
  return NextResponse.json({ workflows: await listWorkflows() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, nodes, edges, active } = body;
    if (!id || !name || !Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: 'id, name, nodes, edges required' }, { status: 400 });
    }
    const stored = await saveWorkflow({ id, name, nodes, edges, active: active !== false });
    return NextResponse.json({ success: true, workflow: { id: stored.id, name: stored.name, active: stored.active, updatedAt: stored.updatedAt } });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save workflow' }, { status: 500 });
  }
}
