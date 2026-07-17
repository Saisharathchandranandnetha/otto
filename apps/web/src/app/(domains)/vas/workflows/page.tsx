import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const VAS_TEMPLATES: Template[] = [
  { id: 'vas_abandon', name: 'Cart Abandonment', desc: 'Send multi-channel follow-ups to recover lost sales.', icon: 'shopping_cart', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'vas_subscription', name: 'Subscription Renewal', desc: 'Trigger automated billing sequences and loyalty emails.', icon: 'repeat', color: 'text-purple-400', bg: 'bg-purple-50' },
];

export default function VASWorkflows() {
  return (
    <DomainWorkflowEditor 
      domainName="Commerce Playbook"
      description="Automate customer acquisition, retention, and sales."
      templates={VAS_TEMPLATES}
    />
  );
}
