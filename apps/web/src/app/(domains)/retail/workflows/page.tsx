import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const TEMPLATES: Template[] = [
  { id: 'rt_personal', name: 'Recommendation Engine', desc: 'AI Personalization Engine — product recommendations from behavior and purchase history.', icon: 'person_heart', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'rt_support', name: 'Shopper Support Agent', desc: 'AI Customer Support Agent — instant order, return and stock answers 24/7.', icon: 'support_agent', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'rt_copilot', name: 'Store Staff Copilot', desc: 'AI Employee Copilot — automates restock requests, price updates and shift reports.', icon: 'badge', color: 'text-pink-400', bg: 'bg-pink-50' },
  { id: 'rt_docs', name: 'Invoice & Quote Generator', desc: 'AI Document Generation — invoices, quotations and promo flyers generated on demand.', icon: 'description', color: 'text-pink-400', bg: 'bg-pink-50' },
  { id: 'rt_flow', name: 'Order-to-Delivery Flow', desc: 'Autonomous Workflow Agents — order, payment, warehouse and courier steps run end-to-end.', icon: 'account_tree', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'rt_knowledge', name: 'Catalog Knowledge Assistant', desc: 'AI Knowledge Assistant — accurate product specs and policy answers from all sources.', icon: 'menu_book', color: 'text-pink-400', bg: 'bg-pink-50' },
];

export default function RetailWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Retail Playbook"
      description="Personalized shopping, instant support and automated order workflows."
      templates={TEMPLATES}
    />
  );
}
