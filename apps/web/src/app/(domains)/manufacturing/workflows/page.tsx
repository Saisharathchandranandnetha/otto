import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const MANUFACTURING_TEMPLATES: Template[] = [
  { id: 'mfg_po', name: 'PO Management', desc: 'Auto-generation of Purchase Orders based on ERP inventory thresholds.', icon: 'inventory', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'mfg_supplier', name: 'Supplier Trust', desc: 'Supplier performance evaluation and dynamic compliance routing.', icon: 'verified_user', color: 'text-amber-400', bg: 'bg-amber-50' },
];

export default function ManufacturingWorkflows() {
  return (
    <DomainWorkflowEditor 
      domainName="Manufacturing Playbook"
      description="Factory Floor AI, Supply Chain, and Predictive Maintenance Workflows."
      templates={MANUFACTURING_TEMPLATES}
    />
  );
}
