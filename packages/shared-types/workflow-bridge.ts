export interface OttoWorkflowExecutionEvent {
  workflowId: string;
  orgId: string;
  triggeredByAgentId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface OttoAgentDomainAction {
  domain: string;
  actionType: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  agentId: string;
}
