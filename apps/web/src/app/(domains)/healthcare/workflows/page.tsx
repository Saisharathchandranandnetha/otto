import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const TEMPLATES: Template[] = [
  { id: 'hc_copilot', name: 'Staff Copilot', desc: 'AI Employee Copilot — automates repetitive admin work for clinic staff (scheduling, intake forms, billing codes).', icon: 'badge', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'hc_triage', name: 'Patient Triage Agent', desc: 'AI Customer Support Agent — instant responses to patient queries with symptom-based routing.', icon: 'support_agent', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'hc_knowledge', name: 'Clinical Knowledge Assistant', desc: 'AI Knowledge Assistant — unified answers from protocols, formularies and patient records.', icon: 'menu_book', color: 'text-red-400', bg: 'bg-red-50' },
  { id: 'hc_docs', name: 'Medical Document Generator', desc: 'AI Document Generation — discharge summaries, referral letters and insurance claims in seconds.', icon: 'description', color: 'text-red-400', bg: 'bg-red-50' },
  { id: 'hc_flow', name: 'Care Coordination Flow', desc: 'Autonomous Workflow Agents — multi-department approvals for admissions, labs and pharmacy.', icon: 'account_tree', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'hc_personal', name: 'Patient Personalization', desc: 'AI Personalization Engine — tailored care plans and reminders from patient history.', icon: 'person_heart', color: 'text-red-400', bg: 'bg-red-50' },
];

export default function HealthcareWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Healthcare Playbook"
      description="Patient triage, clinical knowledge and care coordination workflows."
      templates={TEMPLATES}
    />
  );
}
