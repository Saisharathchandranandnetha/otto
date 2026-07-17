import { DomainWorkflowEditor, Template } from '../../../../components/DomainWorkflowEditor';

const EDUCATION_TEMPLATES: Template[] = [
  { id: 'edu_admission', name: 'Admission Processing', desc: 'Automated parsing of student applications and document verification.', icon: 'school', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'edu_attendance', name: 'Attendance Tracking', desc: 'Daily attendance synchronization and automated parent notification.', icon: 'co_present', color: 'text-indigo-400', bg: 'bg-indigo-50' },
];

export default function EducationWorkflows() {
  return (
    <DomainWorkflowEditor 
      domainName="Education Playbook"
      description="Manage admission processing and student attendance workflows."
      templates={EDUCATION_TEMPLATES}
    />
  );
}
