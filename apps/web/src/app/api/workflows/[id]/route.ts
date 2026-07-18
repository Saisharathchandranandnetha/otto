import { NextRequest, NextResponse } from 'next/server';
import { getWorkflow, saveWorkflow, deleteWorkflow } from '@/lib/workflow-store';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wf = await getWorkflow(id);
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ workflow: wf });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wf = await getWorkflow(id);
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const stored = await saveWorkflow({ ...wf, ...('active' in body ? { active: !!body.active } : {}), ...('name' in body ? { name: body.name } : {}) });
  return NextResponse.json({ success: true, workflow: { id: stored.id, name: stored.name, active: stored.active } });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteWorkflow(id);
  return NextResponse.json({ success: true });
}
