import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const TEMPLATES: Template[] = [
  { id: 'sup_agent', name: 'Instant Reply Agent', desc: 'AI Customer Support Agent — answers customer queries instantly across chat, email and WhatsApp.', icon: 'support_agent', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'sup_copilot', name: 'Agent Copilot', desc: 'AI Employee Copilot — drafts replies, summarizes tickets and fills CRM fields for human agents.', icon: 'badge', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'sup_knowledge', name: 'Help Center Assistant', desc: 'AI Knowledge Assistant — one accurate answer from docs, FAQs and past tickets.', icon: 'menu_book', color: 'text-purple-400', bg: 'bg-purple-50' },
  { id: 'sup_docs', name: 'Response Doc Generator', desc: 'AI Document Generation — RMA forms, refund letters and SLA reports auto-generated.', icon: 'description', color: 'text-purple-400', bg: 'bg-purple-50' },
  { id: 'sup_flow', name: 'Escalation Workflow', desc: 'Autonomous Workflow Agents — routes tickets across departments with approval gates.', icon: 'account_tree', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'sup_personal', name: 'Customer Personalization', desc: 'AI Personalization Engine — tone, channel and offers tuned to each customer history.', icon: 'person_heart', color: 'text-purple-400', bg: 'bg-purple-50' },
];

export default function SupportWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Customer Support Playbook"
      description="Instant answers, smart escalation and personalized support workflows."
      templates={TEMPLATES}
    />
  );
}
