import { NextResponse } from 'next/server';
import { educationStore } from '@/lib/educationStore';
import { n8nClient, WorkflowSummary, ExecutionSummary } from '@/lib/n8n-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const storeStats = educationStore.getStats();
  const n8nHealthy = await n8nClient.getHealth();
  
  let workflows: WorkflowSummary[] = [];
  let executions: ExecutionSummary[] = [];
  if (n8nHealthy) {
    workflows = await n8nClient.getWorkflows();
    executions = await n8nClient.getExecutions(process.env.N8N_WORKFLOW_ID || '', 10);
  }

  const activeWorkflows = workflows.filter(w => w.active).length;
  
  // Format executions into jobs for the UI
  const jobs = executions.map((ex, idx) => ({
    id: idx + 1,
    name: ex.workflowId === process.env.N8N_WORKFLOW_ID ? "Telegram Chat Integration" : `Workflow ${ex.workflowId}`,
    trigger: "Webhook",
    status: ex.status,
    time: ex.startedAt,
    detail: ex.mode
  }));

  return NextResponse.json({
    copilot: {
      hours_saved: 47,
      tasks_automated_today: 12,
      active_agents: 4
    },
    support: {
      total_today: storeStats.total_today,
      resolved: storeStats.resolved,
      escalated: storeStats.escalated,
      pending: storeStats.pending,
      avg_response_ms: storeStats.avg_response_ms
    },
    knowledge: {
      success_rate: 91,
      top_topic: 'Admission Dates',
      queries_handled: 34
    },
    documents: {
      generated_today: 23,
      breakdown: {
        question_papers: 5,
        invoices: 11,
        admit_cards: 7
      }
    },
    workflows: {
      active: activeWorkflows || 3, // fallback to mock if n8n not running
      executions: executions.length || 8,
      pipelines: workflows
    },
    personalization: {
      at_risk_students: 3,
      personalized_responses_today: 67,
      alerts: [
        { student: 'Student #1042', reason: 'Asked about mid-term syllabus 6 times in 2 days', level: 'High' }
      ]
    },
    ai_ceo: {
      current_focus: "Admission Season",
      recommended_action: "Send bulk announcement about admission deadline",
      confidence: 0.87,
      status: "action_pending"
    },
    trust_gate: {
      pending_approvals: storeStats.pending,
      auto_approved_today: storeStats.resolved,
      rejected_today: 1,
      items: [
        { id: 1, description: "Send bulk Telegram message to 847 parents about admission deadline", risk: "Medium" },
        { id: 2, description: "Auto-generate and send 23 fee invoices", risk: "Low" }
      ]
    },
    automation_jobs: {
      running: executions.filter(e => e.status === 'running').length || 1,
      completed_today: executions.filter(e => e.status === 'success').length || 7,
      failed_today: executions.filter(e => e.status === 'error').length || 1,
      jobs: jobs.length > 0 ? jobs : [
        { id: 1, name: "Fee Reminder Batch", trigger: "Daily 9AM", status: "success", time: "9:01 AM", detail: "47 parents notified" }
      ]
    },
    notifications: {
      unread: 4,
      items: [
        { id: 1, text: "3 fee payments overdue — auto-reminder sent", type: "info" },
        { id: 2, text: "Bot confidence below 70% on 2 queries — knowledge base may need update", type: "warning" },
        { id: 3, text: "Admission pipeline completed for Student #1089", type: "success" }
      ]
    },
    kpi_trends: {
      query_volume_7d: [
        { day: 'Mon', Admission: 40, Fees: 24, Exams: 20 },
        { day: 'Tue', Admission: 30, Fees: 13, Exams: 22 },
        { day: 'Wed', Admission: 20, Fees: 58, Exams: 29 },
        { day: 'Thu', Admission: 27, Fees: 39, Exams: 20 },
        { day: 'Fri', Admission: 18, Fees: 48, Exams: 21 },
        { day: 'Sat', Admission: 23, Fees: 38, Exams: 25 },
        { day: 'Sun', Admission: 34, Fees: 43, Exams: 21 },
      ],
      docs_generated_7d: [
        { day: 'Mon', Docs: 12 },
        { day: 'Tue', Docs: 19 },
        { day: 'Wed', Docs: 15 },
        { day: 'Thu', Docs: 22 },
        { day: 'Fri', Docs: 28 },
        { day: 'Sat', Docs: 10 },
        { day: 'Sun', Docs: 14 },
      ],
      resolution_breakdown: {
        resolved: storeStats.resolved || 71,
        escalated: storeStats.escalated || 5,
        pending: storeStats.pending || 13
      }
    },
    n8n_status: {
      healthy: n8nHealthy
    }
  });
}
