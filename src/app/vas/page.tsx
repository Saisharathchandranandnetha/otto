'use client';

import { AppShell } from '@/components/AppShell';
import { WorkflowBuilder } from '@/components/WorkflowBuilder';

const TEMPLATES = [
  { id: 'healthcare_triage', name: 'Healthcare Operations', desc: 'Patient intake & symptom triage', icon: 'medical_services', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'legal_contract', name: 'Legal Document Generation', desc: 'Automated NDA & contract drafting', icon: 'gavel', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'manufacturing_maintenance', name: 'Manufacturing Agent', desc: 'Predictive maintenance & parts', icon: 'factory', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'retail_campaign', name: 'Retail Campaign Planner', desc: 'Inventory-aware marketing', icon: 'storefront', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'hr_onboarding', name: 'HR Employee Copilot', desc: 'Automated onboarding & compliance', icon: 'badge', color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function VasPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Highlighted Templates Gallery */}
        <div className="bg-surface-container-low border-b border-surface-container-highest p-6 shrink-0 shadow-sm z-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-title-lg font-bold text-on-surface">Industry Automation Templates</h1>
              <p className="text-body-md text-on-surface-variant mt-1">Start from pre-built, domain-specific autonomous workflows.</p>
            </div>
            <button className="btn-secondary text-label-md py-2 px-4 shadow-sm hover:shadow transition-shadow">
              View All Templates
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="snap-start shrink-0 w-64 bg-surface border border-surface-container-highest rounded-xl p-4 hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 ${t.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined ${t.color}`}>{t.icon}</span>
                  </div>
                  <h3 className="font-semibold text-on-surface text-label-lg mb-1">{t.name}</h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">{t.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container-highest flex items-center justify-between text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-label-sm font-medium">Load Template</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* React Flow Workflow Builder Mock */}
        <div className="flex-1 w-full bg-surface">
          <WorkflowBuilder />
        </div>
      </div>
    </AppShell>
  );
}
