import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const EDUCATION_TEMPLATES: Template[] = [
  { id: 'edu_telegram_support', name: 'Telegram Student Support', desc: 'LIVE — @ottoeducation_Bot answers parents & students instantly; every chat streams to the dashboard.', icon: 'send', color: 'text-sky-500', bg: 'bg-sky-50', popular: true },
  { id: 'edu_admission', name: 'Admission Processing', desc: 'AI Document Generation — parses applications, verifies documents, generates admission letters.', icon: 'school', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'edu_knowledge', name: 'Campus Knowledge Assistant', desc: 'AI Knowledge Assistant — accurate answers from handbooks, circulars and timetables.', icon: 'menu_book', color: 'text-indigo-400', bg: 'bg-indigo-50' },
  { id: 'edu_copilot', name: 'Teacher Copilot', desc: 'AI Employee Copilot — automates attendance, question papers and report cards.', icon: 'badge', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'edu_flow', name: 'Fee & Approval Workflow', desc: 'Autonomous Workflow Agents — fee concessions routed across accounts and principal approval.', icon: 'account_tree', color: 'text-indigo-400', bg: 'bg-indigo-50' },
  { id: 'edu_personal', name: 'Student Personalization', desc: 'AI Personalization Engine — learning plans and reminders tuned per student history.', icon: 'person_heart', color: 'text-indigo-400', bg: 'bg-indigo-50' },
];

export default function EducationWorkflows() {
  return (
    <DomainWorkflowEditor
      domainName="Education Playbook"
      description="Live Telegram support, admissions and personalized learning workflows."
      templates={EDUCATION_TEMPLATES}
    />
  );
}
