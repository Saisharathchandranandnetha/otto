import { NextResponse } from 'next/server';
import { n8nClient, ExecutionSummary } from '@/lib/n8n-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isHealthy = await n8nClient.getHealth();
    
    let workflowActive = false;
    let workflowId = process.env.N8N_WORKFLOW_ID || '';
    let executions: ExecutionSummary[] = [];
    let successRate = 100;
    let executionsToday = 0;
    
    if (isHealthy) {
      const workflows = await n8nClient.getWorkflows();
      
      // Try to find the education workflow
      const edWorkflow = workflows.find(w => w.id === workflowId || w.name.includes('Education'));
      
      if (edWorkflow) {
        workflowActive = edWorkflow.active;
        workflowId = edWorkflow.id;
        
        executions = await n8nClient.getExecutions(workflowId, 10);
        
        if (executions.length > 0) {
          const successes = executions.filter(e => e.status === 'success').length;
          successRate = Math.round((successes / executions.length) * 100);
          
          // Simple count of executions started today
          const today = new Date().toISOString().split('T')[0] || '';
          executionsToday = executions.filter(e => e.startedAt && e.startedAt.startsWith(today)).length;
        }
      } else {
        // Fallback to get latest executions across all workflows if education not specifically found
        executions = await n8nClient.getExecutions(undefined, 10);
      }
    }

    return NextResponse.json({
      n8n_healthy: isHealthy,
      workflow_active: workflowActive,
      workflow_id: workflowId,
      last_execution: executions.length > 0 ? executions[0] : null,
      recent_executions: executions,
      executions_today: executionsToday,
      success_rate: successRate,
      webhook_url: process.env.N8N_WEBHOOK_URL || ''
    });
  } catch (error) {
    return NextResponse.json(
      { n8n_healthy: false, error: 'Failed to connect to n8n backend' },
      { status: 500 }
    );
  }
}
