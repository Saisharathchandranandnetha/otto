import { NextResponse } from 'next/server';
const PgBoss = require('pg-boss');

const dbUrl = process.env.DATABASE_URL || 'postgres://otto:otto@localhost:5432/otto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orgId = req.headers.get('x-org-id');
    
    if (!orgId) {
      return NextResponse.json({ error: 'Missing organization ID context' }, { status: 400 });
    }

    const boss = new PgBoss(dbUrl);
    await boss.start();

    const jobId = await boss.send('agent_tasks', {
      orgId,
      workflowId: body.workflowId,
      input: body.input,
      prompt: body.prompt
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Task enqueued to Flow Nexus successfully.',
      jobId 
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
