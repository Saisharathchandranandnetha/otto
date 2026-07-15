// Otto Engine — direct mode (no external Dify instance required).
// The domain executors in executors.ts now handle all LLM work directly via
// OpenRouter. This module returns metadata that domain-engine.ts stores in the
// action payload for audit trail purposes only.

export interface OttoEngineResult {
  mode: 'direct';
  runId: string;
  workflowId: string;
  completedAt: string;
}

export async function runOttoWorkflow(input: {
  workflowId: string;
  inputs: Record<string, unknown>;
  user: string;
}): Promise<OttoEngineResult> {
  return {
    mode: 'direct',
    runId: `run-${Date.now()}`,
    workflowId: input.workflowId,
    completedAt: new Date().toISOString(),
  };
}
