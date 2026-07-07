export interface OttoWorkflowInput {
  workflowId: string;
  inputs: Record<string, unknown>;
  user: string;
}

export interface OttoWorkflowResult {
  mode: 'live' | 'mock';
  workflowId: string;
  runId: string;
  status: 'succeeded' | 'mocked';
  outputs: Record<string, unknown>;
}

export async function runOttoWorkflow(input: OttoWorkflowInput): Promise<OttoWorkflowResult> {
  const baseUrl = process.env.OTTO_ENGINE_URL;
  const apiKey = process.env.OTTO_ENGINE_KEY;

  if (!baseUrl || !apiKey) {
    return {
      mode: 'mock',
      workflowId: input.workflowId,
      runId: `mock-${input.workflowId}`,
      status: 'mocked',
      outputs: {
        route: 'otto-core-fallback',
        note: 'Otto Engine used the local deterministic playbook.',
      },
    };
  }

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/workflows/run`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: input.inputs,
      response_mode: 'blocking',
      user: input.user,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Otto workflow failed (${res.status}): ${body.slice(0, 240)}`);
  }

  const body = (await res.json()) as {
    workflow_run_id?: string;
    task_id?: string;
    data?: {
      id?: string;
      status?: string;
      outputs?: Record<string, unknown>;
    };
  };

  return {
    mode: 'live',
    workflowId: input.workflowId,
    runId: body.workflow_run_id ?? body.task_id ?? body.data?.id ?? 'otto-run',
    status: 'succeeded',
    outputs: body.data?.outputs ?? {},
  };
}
