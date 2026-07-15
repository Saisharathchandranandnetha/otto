export const THEME2_ACTION_TYPES = [
  'workflow_approval',
  'document_generation',
  'support_response',
  'knowledge_answer',
  'personalization_plan',
] as const;

export type Theme2ActionType = (typeof THEME2_ACTION_TYPES)[number];

export const THEME2_DOMAIN_SLUGS = [
  'education',
  'healthcare',
  'hr',
  'legal',
  'manufacturing',
  'sales',
  'customer_support',
  'retail',
] as const;

export type Theme2DomainSlug = (typeof THEME2_DOMAIN_SLUGS)[number];

export interface Theme2Playbook {
  slug: Theme2DomainSlug;
  industry: string;
  icon: string;
  color: string;
  accent: string;
  operator: string;
  problemStatement: string;
  actionType: Theme2ActionType;
  title: string;
  owner: string;
  signal: string;
  reasoning: string;
  amountInr: number;
  confidence: number;
  impact: {
    primary: string;
    secondary: string;
    costOfDelay: string;
  };
  workflow: string[];
  approvalChain: string[];
  draft: {
    format: string;
    recipient: string;
    body: string;
  };
  sources: string[];
  ottoWorkflow: string;
}

export const THEME2_PLAYBOOKS: Theme2Playbook[] = [
  {
    slug: 'education',
    industry: 'Education',
    icon: 'school',
    color: '#2563eb',
    accent: '#dbeafe',
    operator: 'Admissions and student-success copilot',
    problemStatement: 'AI Knowledge Assistant + AI Document Generation',
    actionType: 'document_generation',
    title: 'Generate admission decision pack',
    owner: 'Admissions desk',
    signal: '42 parent queries, 11 incomplete applications, fee-policy PDF, class capacity sheet',
    reasoning:
      'Parents are waiting for answers and the admission team is manually assembling letters. Otto found completed forms, matched fee policy clauses, and drafted personalized packs for review.',
    amountInr: 0,
    confidence: 0.93,
    impact: {
      primary: '11 packs ready',
      secondary: '6.5 hours saved this week',
      costOfDelay: 'Delay risks 4 seats moving to competitor schools.',
    },
    workflow: [
      'Read application packet',
      'Check capacity and fee rules',
      'Draft admission letter',
      'Attach parent checklist',
      'Wait for staff approval',
    ],
    approvalChain: ['Admissions counselor', 'Accounts office'],
    draft: {
      format: 'Letter + WhatsApp summary',
      recipient: 'Parents of shortlisted applicants',
      body:
        'Your admission file is complete. Please review the attached fee schedule, document checklist, and orientation date before confirming the seat.',
    },
    sources: ['Admission form OCR', 'Fee policy', 'Seat matrix', 'Parent WhatsApp history'],
    ottoWorkflow: 'otto-education-admission-pack',
  },
  {
    slug: 'healthcare',
    industry: 'Healthcare',
    icon: 'medical_services',
    color: '#0f766e',
    accent: '#ccfbf1',
    operator: 'Clinic operations copilot',
    problemStatement: 'Autonomous Workflow Agents',
    actionType: 'workflow_approval',
    title: 'Triage follow-up queue',
    owner: 'Clinic coordinator',
    signal: '27 missed follow-ups, doctor calendar, lab-result inbox, patient consent flags',
    reasoning:
      'Otto found non-clinical follow-ups that are waiting on scheduling, report pickup, or payment confirmation. It prepared the outreach queue but keeps medical judgment behind clinician approval.',
    amountInr: 0,
    confidence: 0.9,
    impact: {
      primary: '27 follow-ups sorted',
      secondary: '14 high-priority calls first',
      costOfDelay: 'Delay increases no-shows and report-collection backlog.',
    },
    workflow: [
      'Classify follow-up reason',
      'Check consent and preferred channel',
      'Match doctor availability',
      'Draft patient message',
      'Pause for coordinator approval',
    ],
    approvalChain: ['Clinic coordinator', 'Doctor for clinical wording'],
    draft: {
      format: 'Call list + WhatsApp draft',
      recipient: 'Patients with pending administrative follow-ups',
      body:
        'Your clinic follow-up is pending. Please choose a slot for report review or call the front desk for scheduling support.',
    },
    sources: ['Appointment register', 'Lab inbox', 'Consent log', 'Doctor calendar'],
    ottoWorkflow: 'otto-healthcare-followup-triage',
  },
  {
    slug: 'hr',
    industry: 'Human Resources',
    icon: 'badge',
    color: '#7c3aed',
    accent: '#ede9fe',
    operator: 'Employee lifecycle agent',
    problemStatement: 'AI Employee Copilot',
    actionType: 'workflow_approval',
    title: 'Run new-hire onboarding',
    owner: 'HR manager',
    signal: '3 offer acceptances, laptop inventory, payroll checklist, policy handbook',
    reasoning:
      'Three new hires start Monday and HR is repeating the same checklist manually. Otto assembled tasks across IT, payroll, and policy acknowledgement with owner approvals.',
    amountInr: 45000,
    confidence: 0.91,
    impact: {
      primary: '3 onboardings staged',
      secondary: '12 handoffs coordinated',
      costOfDelay: 'Delay creates day-one access gaps and payroll rework.',
    },
    workflow: [
      'Create onboarding checklist',
      'Assign IT asset request',
      'Prepare payroll form',
      'Send policy acknowledgement',
      'Collect HR approval',
    ],
    approvalChain: ['HR manager', 'IT admin', 'Payroll owner'],
    draft: {
      format: 'Task bundle + employee email',
      recipient: 'New hires and internal owners',
      body:
        'Welcome pack, first-day schedule, device request, and payroll form are ready. Internal owners have assigned due dates.',
    },
    sources: ['Offer tracker', 'Asset sheet', 'Payroll template', 'Policy handbook'],
    ottoWorkflow: 'otto-hr-onboarding-agent',
  },
  {
    slug: 'legal',
    industry: 'Legal',
    icon: 'gavel',
    color: '#334155',
    accent: '#e2e8f0',
    operator: 'Contract review copilot',
    problemStatement: 'AI Document Generation',
    actionType: 'document_generation',
    title: 'Draft contract risk memo',
    owner: 'Legal associate',
    signal: 'Vendor MSA, clause library, redline history, approval policy',
    reasoning:
      'A vendor contract has non-standard payment, liability, and termination language. Otto drafted a risk memo and negotiation notes for lawyer review, without giving final legal advice.',
    amountInr: 125000,
    confidence: 0.88,
    impact: {
      primary: '9 clause deltas found',
      secondary: '3 require partner review',
      costOfDelay: 'Delay blocks procurement approval and may miss renewal pricing.',
    },
    workflow: [
      'Extract clauses',
      'Compare against playbook',
      'Score risk level',
      'Draft negotiation memo',
      'Wait for lawyer approval',
    ],
    approvalChain: ['Legal associate', 'Partner or counsel'],
    draft: {
      format: 'Risk memo',
      recipient: 'Legal reviewer',
      body:
        'Payment term, liability cap, auto-renewal, and termination clauses differ from the approved template. Suggested fallback language is attached.',
    },
    sources: ['Vendor MSA', 'Clause playbook', 'Prior redlines', 'Approval matrix'],
    ottoWorkflow: 'otto-legal-risk-memo',
  },
  {
    slug: 'manufacturing',
    industry: 'Manufacturing',
    icon: 'precision_manufacturing',
    color: '#b45309',
    accent: '#fef3c7',
    operator: 'Shop-floor workflow agent',
    problemStatement: 'Autonomous Workflow Agents',
    actionType: 'workflow_approval',
    title: 'Open preventive maintenance order',
    owner: 'Plant supervisor',
    signal: 'Machine vibration log, spare-parts stock, shift roster, maintenance SOP',
    reasoning:
      'Line 2 has crossed the vibration threshold twice and the spare bearing is available. Otto staged a maintenance order for the lowest production-impact shift.',
    amountInr: 18500,
    confidence: 0.89,
    impact: {
      primary: '1 downtime window selected',
      secondary: '2.4 hours avoided unplanned loss',
      costOfDelay: 'Delay increases risk of line stoppage during peak shift.',
    },
    workflow: [
      'Detect anomaly',
      'Check spare availability',
      'Choose low-impact shift',
      'Draft work order',
      'Collect supervisor approval',
    ],
    approvalChain: ['Plant supervisor', 'Maintenance lead'],
    draft: {
      format: 'Work order',
      recipient: 'Maintenance lead',
      body:
        'Schedule bearing inspection for Line 2 during B shift. Spare part is available and SOP steps are attached.',
    },
    sources: ['Sensor log', 'Spare inventory', 'Shift roster', 'Maintenance SOP'],
    ottoWorkflow: 'otto-manufacturing-maintenance-order',
  },
  {
    slug: 'sales',
    industry: 'Sales',
    icon: 'query_stats',
    color: '#c026d3',
    accent: '#fae8ff',
    operator: 'Revenue follow-up agent',
    problemStatement: 'AI Personalization Engine',
    actionType: 'personalization_plan',
    title: 'Personalize stalled-deal follow-ups',
    owner: 'Sales lead',
    signal: 'CRM stages, call notes, quote history, buyer objections',
    reasoning:
      'Seven deals are stalled after quotation. Otto matched each buyer objection to prior wins and drafted personalized next steps for the sales lead.',
    amountInr: 760000,
    confidence: 0.92,
    impact: {
      primary: '7 follow-ups ready',
      secondary: 'INR 7.6L pipeline touched',
      costOfDelay: 'Delay lets competitors reset buyer preference.',
    },
    workflow: [
      'Find stalled deals',
      'Extract buyer objection',
      'Select proof point',
      'Draft next-best action',
      'Route for sales approval',
    ],
    approvalChain: ['Sales lead'],
    draft: {
      format: 'Email + call plan',
      recipient: 'Prospects in negotiation',
      body:
        'Sharing the revised proposal, proof point from a similar customer, and a 15-minute slot to close open procurement questions.',
    },
    sources: ['CRM export', 'Call notes', 'Quote ledger', 'Win-loss notes'],
    ottoWorkflow: 'otto-sales-personalization-plan',
  },
  {
    slug: 'customer_support',
    industry: 'Customer Support',
    icon: 'support_agent',
    color: '#dc2626',
    accent: '#fee2e2',
    operator: 'Support resolution agent',
    problemStatement: 'AI Customer Support Agent',
    actionType: 'support_response',
    title: 'Resolve delayed-order tickets',
    owner: 'Support lead',
    signal: '18 open tickets, order status sheet, refund policy, courier API snapshot',
    reasoning:
      'Multiple customers are asking about delayed orders. Otto grouped duplicates, checked status, and drafted policy-safe replies with escalation only where needed.',
    amountInr: 0,
    confidence: 0.94,
    impact: {
      primary: '18 tickets grouped',
      secondary: '12 can be answered instantly',
      costOfDelay: 'Delay lowers CSAT and increases repeat contacts.',
    },
    workflow: [
      'Cluster similar tickets',
      'Fetch order status',
      'Apply refund policy',
      'Draft response',
      'Escalate exceptions',
    ],
    approvalChain: ['Support lead'],
    draft: {
      format: 'Ticket replies',
      recipient: 'Customers with delayed orders',
      body:
        'Your order is delayed in transit. We have added tracking details and the next eligible refund or replacement step based on policy.',
    },
    sources: ['Ticket inbox', 'Order sheet', 'Refund policy', 'Courier status'],
    ottoWorkflow: 'otto-support-ticket-resolution',
  },
  {
    slug: 'retail',
    industry: 'Retail',
    icon: 'storefront',
    color: '#16a34a',
    accent: '#dcfce7',
    operator: 'Store growth and inventory agent',
    problemStatement: 'Autonomous Workflow Agents + AI Personalization Engine',
    actionType: 'personalization_plan',
    title: 'Launch replenishment and loyalty campaign',
    owner: 'Store owner',
    signal: 'Low stock, WhatsApp buyers, purchase history, supplier prices',
    reasoning:
      'Two fast-moving products are near stockout and repeat buyers have matching purchase patterns. Otto drafted a supplier reorder and a personalized loyalty nudge.',
    amountInr: 31500,
    confidence: 0.91,
    impact: {
      primary: '2 stockouts prevented',
      secondary: '43 buyers targeted',
      costOfDelay: 'Delay risks lost weekend sales and lower repeat conversion.',
    },
    workflow: [
      'Detect low-stock SKUs',
      'Segment repeat buyers',
      'Draft supplier reorder',
      'Draft loyalty message',
      'Ask owner approval',
    ],
    approvalChain: ['Store owner'],
    draft: {
      format: 'Supplier PO + buyer WhatsApp copy',
      recipient: 'Supplier and repeat customers',
      body:
        'Reorder request is ready for the supplier. Repeat customers receive a personalized arrival alert and loyalty offer.',
    },
    sources: ['Inventory table', 'Invoice history', 'WhatsApp export', 'Supplier ledger'],
    ottoWorkflow: 'otto-retail-growth-agent',
  },
];

export function getTheme2Playbook(slug: Theme2DomainSlug) {
  return THEME2_PLAYBOOKS.find((playbook) => playbook.slug === slug);
}

export function isTheme2ActionType(value: string): value is Theme2ActionType {
  return THEME2_ACTION_TYPES.includes(value as Theme2ActionType);
}
