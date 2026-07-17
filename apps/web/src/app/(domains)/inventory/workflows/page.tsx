import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const INVENTORY_TEMPLATES: Template[] = [
  { id: 'inv_stock', name: 'Stock Optimization', desc: 'Predictive analytics for reordering and demand forecasting.', icon: 'inventory', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'inv_audit', name: 'Automated Audit', desc: 'Cycle counting and discrepancy resolution workflows.', icon: 'fact_check', color: 'text-green-500', bg: 'bg-green-50' },
];

export default function InventoryWorkflows() {
  return (
    <DomainWorkflowEditor 
      domainName="Inventory Playbook"
      description="Manage stock optimization and automated audits."
      templates={INVENTORY_TEMPLATES}
    />
  );
}
