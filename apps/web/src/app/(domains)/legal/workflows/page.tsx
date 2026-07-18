import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const TEMPLATES: Template[] = [
  { id: 'lg_docs', name: 'Contract Generator', desc: 'AI Document Generation — contracts, NDAs and legal notices drafted from templates.', icon: 'description', color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 'lg_knowledge', name: 'Case Knowledge Assistant', desc: 'AI Knowledge Assistant — search precedents, statutes and internal memos in one place.', icon: 'menu_book', color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 'lg_copilot', name: 'Paralegal Copilot', desc: 'AI Employee Copilot — automates filing, deadline tracking and client intake.', icon: 'badge', color: 'text-slate-400', bg: 'bg-slate-100' },
  { id: 'lg_flow', name: 'Review & Approval Flow', desc: 'Autonomous Workflow Agents — multi-partner contract review with sign-off gates.', icon: 'account_tree', color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 'lg_support', name: 'Client Query Agent', desc: 'AI Customer Support Agent — instant status updates and FAQ answers for clients.', icon: 'support_agent', color: 'text-slate-400', bg: 'bg-slate-100' },
  { id: 'lg_personal', name: 'Client Personalization', desc: 'AI Personalization Engine — advice summaries adapted to each client’s matter history.', icon: 'person_heart', color: 'text-slate-400', bg: 'bg-slate-100' },
];

export default function LegalWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Legal Playbook"
      description="Contract drafting, case research and approval workflows."
      templates={TEMPLATES}
    />
  );
}
