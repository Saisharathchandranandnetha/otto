'use client';

import { useOtto } from '@/components/useOtto';
import { ApprovalCard } from '@/components/ApprovalCard';
import { TrustMeter } from '@/components/TrustMeter';
import { AppShell } from '@/components/AppShell';
import { DomainEnginePanel } from '@/components/DomainEnginePanel';
import { AIAssistant } from '@/components/AIAssistant';

export default function FeedPage() {
  const { actions, grants, act, revoke, refresh } = useOtto();

  return (
    <AppShell>
      {/* Landing Page Hero Section */}
      <section className="bg-primary/5 py-12 px-container-padding border-b border-surface-container-highest">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-headline-lg font-bold text-on-surface mb-4">
            Otto — Autonomous Workflow Agents Platform
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl">
            Otto is a production-grade platform for building autonomous workflow agents with earned-trust safety models. 
            We combine visual workflow orchestration, LLM model management, RAG pipelines, and agent capabilities with Otto's unique approval gates and domain-specific playbooks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface">
              <h3 className="font-semibold text-on-surface flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                Powered by Vas Engine
              </h3>
              <ul className="text-body-sm text-on-surface-variant space-y-2 list-disc list-inside">
                <li>Visual Workflow Builder for rapid testing</li>
                <li>Comprehensive Model Support (GPT, Gemini, Llama)</li>
                <li>RAG Pipelines with document extraction</li>
                <li>Agent Capabilities with Function Calling</li>
              </ul>
              <div className="mt-4">
                <a href="http://localhost/install" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-body-sm font-medium hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  Open Visual Workflow Builder
                </a>
              </div>
            </div>
            
            <div className="card bg-surface">
              <h3 className="font-semibold text-on-surface flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">gavel</span>
                Otto Safety Moat
              </h3>
              <ul className="text-body-sm text-on-surface-variant space-y-2 list-disc list-inside">
                <li>Approval Gates (Human-in-the-loop validation)</li>
                <li>Trust Ladder (Agents earn autonomy over time)</li>
                <li>Action Reversals and Full Audit Trails</li>
                <li>Domain-specific deterministic playbooks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Selection & Testing */}
      <div className="bg-surface py-8 px-container-padding border-b border-surface-container-highest">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-headline-md font-semibold text-on-surface mb-2">
            Test Theme 2 Industry Playbooks
          </h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Select a target industry below to run a simulated autonomous agent workflow. 
            Otto will queue the agent's proposed actions for your review in the Approval Queue.
          </p>
          <DomainEnginePanel onRefresh={refresh} />
        </div>
      </div>

      {/* Trust Meter Strip */}
      {grants.length > 0 && (
        <section className="px-container-padding py-base bg-surface-container-lowest border-b border-surface-container-highest shadow-sm">
          <div className="max-w-4xl mx-auto">
            <TrustMeter grants={grants} onRevoke={revoke} />
          </div>
        </section>
      )}

      {/* Main Feed: Approval Queue */}
      <main className="flex-1 overflow-y-auto px-container-padding py-stack-md flex flex-col gap-stack-md max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end">
          <h2 className="text-headline-md text-on-surface">
            Approval Queue
          </h2>
          {actions.filter((a) => a.status === 'awaiting_approval').length > 0 && (
            <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
              {actions.filter((a) => a.status === 'awaiting_approval').length} Pending
            </span>
          )}
        </div>

        {actions.length === 0 ? (
          <div className="card my-8 text-center bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-4">check_circle</span>
            <p className="text-headline-sm text-on-surface">Queue is empty</p>
            <p className="mt-2 text-body-md text-on-surface-variant max-w-md mx-auto">
              Select an industry playbook from above to trigger an autonomous agent workflow. 
              Its actions will appear here for your approval.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {actions.map((a) => (
              <ApprovalCard key={a.id} action={a} onAct={act} />
            ))}
          </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </AppShell>
  );
}
