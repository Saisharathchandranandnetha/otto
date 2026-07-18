import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const TEMPLATES: Template[] = [
  { id: 'sl_copilot', name: 'Sales Rep Copilot', desc: 'AI Employee Copilot — logs calls, updates CRM and drafts follow-ups automatically.', icon: 'badge', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'sl_docs', name: 'Quote & Proposal Generator', desc: 'AI Document Generation — personalized quotations and proposals in one click.', icon: 'description', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'sl_personal', name: 'Lead Personalization', desc: 'AI Personalization Engine — outreach tailored to each prospect’s behavior and history.', icon: 'person_heart', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  { id: 'sl_flow', name: 'Deal Approval Flow', desc: 'Autonomous Workflow Agents — discount and contract approvals across finance and legal.', icon: 'account_tree', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'sl_knowledge', name: 'Sales Knowledge Assistant', desc: 'AI Knowledge Assistant — instant answers on pricing, battlecards and product specs.', icon: 'menu_book', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  { id: 'sl_support', name: 'Prospect Response Agent', desc: 'AI Customer Support Agent — instant replies to inbound leads before they go cold.', icon: 'support_agent', color: 'text-emerald-400', bg: 'bg-emerald-50' },
];

export default function SalesWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Sales Playbook"
      description="Pipeline automation, quote generation and personalized outreach workflows."
      templates={TEMPLATES}
    />
  );
}
