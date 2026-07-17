import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const LEDGER_TEMPLATES: Template[] = [
  { id: 'ledger_invoice', name: 'Invoice Automation', desc: 'Auto-generate and email invoices based on CRM triggers.', icon: 'receipt', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'ledger_reconcile', name: 'Payment Reconciliation', desc: 'Sync Stripe transactions with digital ledger daily.', icon: 'sync', color: 'text-emerald-400', bg: 'bg-emerald-50' },
];

export default function LedgerWorkflows() {
  return (
    <DomainWorkflowEditor 
      domainName="Finance Playbook"
      description="Automate billing, reconciliation, and financial workflows."
      templates={LEDGER_TEMPLATES}
    />
  );
}
