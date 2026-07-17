import { createAction, draftAction, type ActionRow } from './machine';
import { routeDraftedAction } from './gate';
import { execute } from './executors';
import { runOttoWorkflow } from '@/integrations/otto-engine';
import {
  getTheme2Playbook,
  THEME2_PLAYBOOKS,
  type Theme2DomainSlug,
} from '@/lib/theme2';

export interface DomainRunResult {
  actionId: string;
  domain: Theme2DomainSlug;
  route: 'auto_approved' | 'awaiting_human';
  status: ActionRow['status'];
}

export async function runDomainPlaybook(slug: Theme2DomainSlug): Promise<DomainRunResult> {
  const playbook = getTheme2Playbook(slug);
  if (!playbook) {
    throw new Error(`Unknown Theme 2 domain: ${slug}`);
  }

  const engine = await runOttoWorkflow({
    workflowId: playbook.ottoWorkflow,
    inputs: {
      domain: playbook.industry,
      signal: playbook.signal,
      workflow: playbook.workflow,
      draft: playbook.draft,
    },
    user: `otto-${playbook.slug}`,
  });

  const payload = {
    domain: playbook.slug,
    domain_name: playbook.industry,
    icon: playbook.icon,
    color: playbook.color,
    accent: playbook.accent,
    problem_statement: playbook.problemStatement,
    title: playbook.title,
    owner: playbook.owner,
    signal: playbook.signal,
    operator: playbook.operator,
    workflow_steps: playbook.workflow,
    approval_chain: playbook.approvalChain,
    draft: playbook.draft,
    impact: playbook.impact,
    sources: playbook.sources,
    confidence: playbook.confidence,
    engine,
  };

  const action = await createAction({
    orgId: '00000000-0000-0000-0000-000000000000',
    type: playbook.actionType,
    amount: playbook.amountInr,
    reasoning: playbook.reasoning,
    payload,
  });

  await draftAction(action.id, {
    reasoning: playbook.reasoning,
    detail: {
      domain: playbook.slug,
      playbook: playbook.ottoWorkflow,
      workflow_steps: playbook.workflow.length,
      confidence: playbook.confidence,
    },
  });

  const route = await routeDraftedAction({ ...action, status: 'drafted' });
  if (route === 'auto_approved') {
    await execute(action.id);
  }

  return {
    actionId: action.id,
    domain: playbook.slug,
    route,
    status: route === 'auto_approved' ? 'executed' : 'awaiting_approval',
  };
}

export async function runAllDomainPlaybooks(): Promise<DomainRunResult[]> {
  const results: DomainRunResult[] = [];
  for (const playbook of THEME2_PLAYBOOKS) {
    results.push(await runDomainPlaybook(playbook.slug));
  }
  return results;
}
