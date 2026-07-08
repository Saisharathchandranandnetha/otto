'use client';

import { AppShell } from '@/components/AppShell';
import { WorkflowBuilder } from '@/components/WorkflowBuilder';

const TEMPLATES = [
  { id: 'education_copilot', name: 'Education AI Knowledge Assistant', file: '/templates/education_copilot.yml' },
  { id: 'healthcare_triage', name: 'Healthcare Clinic Operations Copilot', file: '/templates/healthcare_triage.yml' },
  { id: 'hr_onboarding', name: 'HR AI Employee Copilot', file: '/templates/hr_onboarding.yml' },
  { id: 'legal_contract', name: 'Legal AI Document Generation', file: '/templates/legal_contract.yml' },
  { id: 'manufacturing_maintenance', name: 'Manufacturing Workflow Agent', file: '/templates/manufacturing_maintenance.yml' },
  { id: 'sales_personalization', name: 'Sales Personalization Engine', file: '/templates/sales_personalization.yml' },
  { id: 'support_agent', name: 'Customer Support AI Agent', file: '/templates/support_agent.yml' },
  { id: 'retail_campaign', name: 'Retail Replenishment Campaign', file: '/templates/retail_campaign.yml' },
];

export default function VasPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Templates Banner */}
        <div className="bg-surface-container-low border-b border-surface-container-highest p-4 flex gap-4 overflow-x-auto whitespace-nowrap items-center shrink-0">
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface text-body-md">VAS Industry Templates</span>
            <span className="text-body-sm text-on-surface-variant">Download and import a DSL into the Visual Builder below:</span>
          </div>
          <div className="h-8 w-px bg-surface-container-highest mx-2 shrink-0"></div>
          {TEMPLATES.map((t) => (
            <a
              key={t.id}
              href={t.file}
              download
              className="inline-flex items-center gap-2 bg-surface border border-surface-container-highest px-3 py-1.5 rounded-full text-label-sm hover:bg-surface-container transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">download</span>
              {t.name}
            </a>
          ))}
        </div>

        {/* React Flow Workflow Builder Mock */}
        <div className="flex-1 w-full bg-surface">
          <WorkflowBuilder />
        </div>
      </div>
    </AppShell>
  );
}
