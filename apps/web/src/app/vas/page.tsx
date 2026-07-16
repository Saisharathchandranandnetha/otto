'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';

/* ─────────────────────────────────────────────────────────────────
   TEMPLATES — 5 core + browse-all library
   ───────────────────────────────────────────────────────────────── */

interface Template {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  category: string;
  popular?: boolean;
  uses?: string;
}

const TEMPLATES: Template[] = [
  { id: 'healthcare_triage', name: 'Healthcare Triage', desc: 'Patient intake, symptom NER & priority routing', icon: 'medical_services', color: 'text-blue-500', bg: 'bg-blue-50', category: 'Healthcare', popular: true, uses: '12.4k' },
  { id: 'legal_contract', name: 'Legal Contract Drafter', desc: 'NDA & contract generation with clause RAG', icon: 'gavel', color: 'text-purple-500', bg: 'bg-purple-50', category: 'Legal', popular: true, uses: '9.1k' },
  { id: 'manufacturing_maintenance', name: 'Predictive Maintenance', desc: 'IoT anomaly detection & maintenance scheduling', icon: 'factory', color: 'text-amber-600', bg: 'bg-amber-50', category: 'Manufacturing', popular: true, uses: '7.8k' },
  { id: 'retail_campaign', name: 'Retail Campaign Planner', desc: 'Inventory-aware marketing & promo generation', icon: 'storefront', color: 'text-green-600', bg: 'bg-green-50', category: 'Retail', popular: true, uses: '11.2k' },
  { id: 'hr_onboarding', name: 'HR Onboarding Copilot', desc: 'Automated employee onboarding & compliance', icon: 'badge', color: 'text-rose-500', bg: 'bg-rose-50', category: 'HR', popular: true, uses: '8.6k' },
];

const BROWSE_TEMPLATES: Template[] = [
  // Healthcare
  { id: 'health_claims', name: 'Insurance Claims Processor', desc: 'Auto-extract claim details, validate policy coverage & route for adjudication', icon: 'receipt_long', color: 'text-blue-500', bg: 'bg-blue-50', category: 'Healthcare', uses: '5.3k' },
  { id: 'health_scheduling', name: 'Appointment Scheduler', desc: 'AI-powered scheduling with doctor availability & patient preference matching', icon: 'calendar_month', color: 'text-blue-400', bg: 'bg-blue-50', category: 'Healthcare', uses: '4.1k' },
  // Legal
  { id: 'legal_compliance', name: 'Regulatory Compliance Check', desc: 'Scan documents against regulatory requirements & flag violations', icon: 'policy', color: 'text-purple-500', bg: 'bg-purple-50', category: 'Legal', uses: '3.9k' },
  { id: 'legal_discovery', name: 'eDiscovery Pipeline', desc: 'Intelligent document review, tagging & privilege classification', icon: 'search', color: 'text-purple-400', bg: 'bg-purple-50', category: 'Legal', uses: '2.8k' },
  // Manufacturing
  { id: 'mfg_quality', name: 'Quality Inspection Agent', desc: 'Visual defect detection with image classification & rejection routing', icon: 'verified', color: 'text-amber-600', bg: 'bg-amber-50', category: 'Manufacturing', uses: '6.2k' },
  { id: 'mfg_supply', name: 'Supply Chain Optimizer', desc: 'Demand forecasting, vendor scoring & auto-reorder workflows', icon: 'local_shipping', color: 'text-amber-500', bg: 'bg-amber-50', category: 'Manufacturing', uses: '4.7k' },
  // Retail
  { id: 'retail_returns', name: 'Returns & Refund Agent', desc: 'Automated return eligibility check, refund processing & customer comms', icon: 'assignment_return', color: 'text-green-600', bg: 'bg-green-50', category: 'Retail', uses: '7.5k' },
  { id: 'retail_pricing', name: 'Dynamic Pricing Engine', desc: 'Competitor monitoring, demand analysis & price optimization', icon: 'trending_up', color: 'text-green-500', bg: 'bg-green-50', category: 'Retail', uses: '3.4k' },
  // HR
  { id: 'hr_performance', name: 'Performance Review Agent', desc: 'Auto-collect peer feedback, summarize achievements & draft reviews', icon: 'star', color: 'text-rose-500', bg: 'bg-rose-50', category: 'HR', uses: '3.2k' },
  { id: 'hr_recruitment', name: 'Resume Screening Pipeline', desc: 'Parse resumes, score candidates & schedule interviews automatically', icon: 'person_search', color: 'text-rose-400', bg: 'bg-rose-50', category: 'HR', uses: '6.8k' },
  // Finance
  { id: 'fin_invoice', name: 'Invoice Processing Agent', desc: 'Extract line items, match POs & route for approval with fraud detection', icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50', category: 'Finance', uses: '10.1k', popular: true },
  { id: 'fin_expense', name: 'Expense Report Auditor', desc: 'Policy compliance check, duplicate detection & auto-categorization', icon: 'account_balance', color: 'text-emerald-500', bg: 'bg-emerald-50', category: 'Finance', uses: '5.6k' },
  // Education
  { id: 'edu_grading', name: 'Assignment Grader', desc: 'AI-assisted grading with rubric matching & personalized feedback', icon: 'school', color: 'text-indigo-500', bg: 'bg-indigo-50', category: 'Education', uses: '4.3k' },
  { id: 'edu_content', name: 'Course Content Generator', desc: 'Generate quizzes, summaries & lesson plans from source material', icon: 'auto_stories', color: 'text-indigo-400', bg: 'bg-indigo-50', category: 'Education', uses: '3.1k' },
  // Real Estate
  { id: 're_listing', name: 'Property Listing Agent', desc: 'Auto-generate descriptions, virtual staging & market analysis', icon: 'home', color: 'text-teal-500', bg: 'bg-teal-50', category: 'Real Estate', uses: '2.9k' },
];

/* ─────────────────────────────────────────────────────────────────
   COMPLEX WORKFLOW GRAPHS — rich, industry-specific node trees
   (kept for template metadata; canvas is now the n8n iframe)
   ───────────────────────────────────────────────────────────────── */

const nodeStyle = (bg: string, border: string) => ({
  background: bg, border: `1.5px solid ${border}`, borderRadius: '12px', padding: '12px 16px',
  fontSize: '13px', fontWeight: 500, minWidth: '180px',
});

function getTemplateGraph(templateId: string) {
  switch (templateId) {
    case 'healthcare_triage':
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#f0f9ff', '#7dd3fc'), data: { label: '🏥 Patient Intake Form' } },
          { id: '2', position: { x: 120, y: 100 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '📋 Symptom Extraction (NER)' } },
          { id: '3', position: { x: 580, y: 100 }, style: nodeStyle('#f0fdf4', '#86efac'), data: { label: '🗂️ Medical History Lookup' } },
          { id: '4', position: { x: 350, y: 210 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '🤖 LLM: Triage Assessment' } },
          { id: '5', position: { x: 120, y: 320 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '⚠️ Critical? (Priority Gate)' } },
          { id: '6', position: { x: 580, y: 320 }, style: nodeStyle('#f5f3ff', '#c4b5fd'), data: { label: '📊 Risk Score Calculator' } },
          { id: '7', position: { x: 0, y: 430 }, style: nodeStyle('#fef2f2', '#f87171'), data: { label: '🚨 Emergency Alert → Doctor' } },
          { id: '8', position: { x: 280, y: 430 }, style: nodeStyle('#fffbeb', '#fbbf24'), data: { label: '⏳ Schedule Appointment' } },
          { id: '9', position: { x: 580, y: 430 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '💊 Self-Care Instructions' } },
          { id: '10', type: 'output', position: { x: 350, y: 550 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Notify Patient & Log EHR' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7', label: 'Critical', style: { stroke: '#ef4444' } },
          { id: 'e5-8', source: '5', target: '8', label: 'Moderate' },
          { id: 'e6-9', source: '6', target: '9', label: 'Low Risk' },
          { id: 'e7-10', source: '7', target: '10', animated: true },
          { id: 'e8-10', source: '8', target: '10' },
          { id: 'e9-10', source: '9', target: '10' },
        ],
      };
    case 'legal_contract':
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#faf5ff', '#d8b4fe'), data: { label: '📝 Contract Request Intake' } },
          { id: '2', position: { x: 120, y: 110 }, style: nodeStyle('#f5f3ff', '#c4b5fd'), data: { label: '🔍 RAG: Clause Library Search' } },
          { id: '3', position: { x: 580, y: 110 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '📂 Template Matcher' } },
          { id: '4', position: { x: 350, y: 220 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '🤖 LLM: Draft Generation' } },
          { id: '5', position: { x: 120, y: 330 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '⚖️ Compliance Validator' } },
          { id: '6', position: { x: 580, y: 330 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '💰 Risk & Liability Scorer' } },
          { id: '7', position: { x: 350, y: 430 }, style: nodeStyle('#fff7ed', '#fdba74'), data: { label: '👤 Partner Review Gate' } },
          { id: '8', position: { x: 120, y: 530 }, style: nodeStyle('#fef2f2', '#f87171'), data: { label: '🔄 Revision Requested' } },
          { id: '9', position: { x: 580, y: 530 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✍️ Digital Signature' } },
          { id: '10', type: 'output', position: { x: 350, y: 640 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Archive & Notify Parties' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8', label: 'Rejected', style: { stroke: '#ef4444' } },
          { id: 'e7-9', source: '7', target: '9', label: 'Approved', style: { stroke: '#22c55e' } },
          { id: 'e8-4', source: '8', target: '4', label: 'Re-draft', animated: true, style: { stroke: '#f59e0b' } },
          { id: 'e9-10', source: '9', target: '10', animated: true },
        ],
      };
    case 'manufacturing_maintenance':
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#fffbeb', '#fcd34d'), data: { label: '📡 IoT Sensor Data Stream' } },
          { id: '2', position: { x: 120, y: 110 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '📈 Time-Series Aggregator' } },
          { id: '3', position: { x: 580, y: 110 }, style: nodeStyle('#fff7ed', '#fdba74'), data: { label: '🌡️ Threshold Monitor' } },
          { id: '4', position: { x: 350, y: 220 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '🤖 Anomaly Detection Model' } },
          { id: '5', position: { x: 120, y: 330 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '⚠️ Severity Classifier' } },
          { id: '6', position: { x: 580, y: 330 }, style: nodeStyle('#f5f3ff', '#c4b5fd'), data: { label: '📦 Spare Parts Inventory' } },
          { id: '7', position: { x: 0, y: 440 }, style: nodeStyle('#fef2f2', '#f87171'), data: { label: '🛑 Emergency Shutdown' } },
          { id: '8', position: { x: 280, y: 440 }, style: nodeStyle('#fff7ed', '#fb923c'), data: { label: '🔧 Schedule Maintenance' } },
          { id: '9', position: { x: 580, y: 440 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '📋 Auto-Order Parts' } },
          { id: '10', type: 'output', position: { x: 350, y: 560 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Update CMMS & Alert Team' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7', label: 'Critical', style: { stroke: '#ef4444' } },
          { id: 'e5-8', source: '5', target: '8', label: 'Warning' },
          { id: 'e6-9', source: '6', target: '9', label: 'Low Stock' },
          { id: 'e7-10', source: '7', target: '10', animated: true },
          { id: 'e8-10', source: '8', target: '10' },
          { id: 'e9-10', source: '9', target: '10' },
        ],
      };
    case 'retail_campaign':
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#f0fdf4', '#86efac'), data: { label: '📊 Inventory Threshold Alert' } },
          { id: '2', position: { x: 120, y: 110 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '📦 Stock Level Analyzer' } },
          { id: '3', position: { x: 580, y: 110 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '👥 Customer Segmentation' } },
          { id: '4', position: { x: 350, y: 220 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '🤖 LLM: Campaign Generator' } },
          { id: '5', position: { x: 120, y: 330 }, style: nodeStyle('#faf5ff', '#d8b4fe'), data: { label: '🎨 Creative Asset Builder' } },
          { id: '6', position: { x: 580, y: 330 }, style: nodeStyle('#fff7ed', '#fdba74'), data: { label: '💲 Discount Calculator' } },
          { id: '7', position: { x: 350, y: 430 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '👤 Manager Approval Gate' } },
          { id: '8', position: { x: 120, y: 540 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '📱 Push to Channels' } },
          { id: '9', position: { x: 580, y: 540 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '📈 Performance Tracker' } },
          { id: '10', type: 'output', position: { x: 350, y: 650 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Campaign Report & ROI' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8', label: 'Approved', style: { stroke: '#22c55e' }, animated: true },
          { id: 'e7-4', source: '7', target: '4', label: 'Revise', style: { stroke: '#f59e0b' } },
          { id: 'e8-9', source: '8', target: '9' },
          { id: 'e9-10', source: '9', target: '10' },
        ],
      };
    case 'hr_onboarding':
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#fff1f2', '#fda4af'), data: { label: '🎉 New Hire Event (HRIS)' } },
          { id: '2', position: { x: 120, y: 110 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '📝 Generate Offer Letter' } },
          { id: '3', position: { x: 580, y: 110 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '🔑 IT Provisioning Ticket' } },
          { id: '4', position: { x: 350, y: 220 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '🤖 LLM: Onboarding Plan' } },
          { id: '5', position: { x: 120, y: 330 }, style: nodeStyle('#f5f3ff', '#c4b5fd'), data: { label: '📚 Training Module Assign' } },
          { id: '6', position: { x: 580, y: 330 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '🏢 Workspace & Badge Setup' } },
          { id: '7', position: { x: 350, y: 430 }, style: nodeStyle('#fff7ed', '#fdba74'), data: { label: '👤 Manager Approval Gate' } },
          { id: '8', position: { x: 120, y: 540 }, style: nodeStyle('#f0fdf4', '#86efac'), data: { label: '📧 Welcome Email Sequence' } },
          { id: '9', position: { x: 580, y: 540 }, style: nodeStyle('#faf5ff', '#d8b4fe'), data: { label: '📋 Compliance Checklist' } },
          { id: '10', type: 'output', position: { x: 350, y: 650 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Onboarding Complete' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8', label: 'Approved', style: { stroke: '#22c55e' }, animated: true },
          { id: 'e7-9', source: '7', target: '9', animated: true },
          { id: 'e8-10', source: '8', target: '10' },
          { id: 'e9-10', source: '9', target: '10' },
        ],
      };
    default: {
      // For browse templates, generate a generic complex graph
      return {
        nodes: [
          { id: '1', type: 'input', position: { x: 350, y: 0 }, style: nodeStyle('#f8fafc', '#94a3b8'), data: { label: '📥 Input Trigger' } },
          { id: '2', position: { x: 120, y: 110 }, style: nodeStyle('#eff6ff', '#93c5fd'), data: { label: '🔍 Data Extraction' } },
          { id: '3', position: { x: 580, y: 110 }, style: nodeStyle('#f5f3ff', '#c4b5fd'), data: { label: '📂 Context Lookup' } },
          { id: '4', position: { x: 350, y: 220 }, style: nodeStyle('#fefce8', '#fde047'), data: { label: '🤖 LLM Processing' } },
          { id: '5', position: { x: 120, y: 330 }, style: nodeStyle('#fef2f2', '#fca5a5'), data: { label: '⚖️ Validation Gate' } },
          { id: '6', position: { x: 580, y: 330 }, style: nodeStyle('#ecfdf5', '#6ee7b7'), data: { label: '📊 Scoring Engine' } },
          { id: '7', position: { x: 350, y: 430 }, style: nodeStyle('#fff7ed', '#fdba74'), data: { label: '👤 Approval Gate' } },
          { id: '8', type: 'output', position: { x: 350, y: 540 }, style: nodeStyle('#f0fdf4', '#4ade80'), data: { label: '✅ Execute & Notify' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e4-6', source: '4', target: '6' },
          { id: 'e5-7', source: '5', target: '7' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8', label: 'Approved', animated: true },
        ],
      };
    }
  }
}

/* ─────────────────────────────────────────────────────────────────
   AI STUDIO CATEGORIES — sidebar for the Dify tab
   ───────────────────────────────────────────────────────────────── */

interface AICategory {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
}

const AI_CATEGORIES: AICategory[] = [
  { id: 'chatbots', name: 'Chatbots', desc: 'Build conversational AI assistants with custom knowledge and personality', icon: 'chat', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'text_generators', name: 'Text Generators', desc: 'Create content generation pipelines for documents, emails, and reports', icon: 'edit_note', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'agent_workflows', name: 'Agent Workflows', desc: 'Design multi-step AI agent workflows with tool use and reasoning', icon: 'account_tree', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'knowledge_base', name: 'Knowledge Base', desc: 'Upload and manage documents for RAG-powered retrieval and Q&A', icon: 'library_books', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

/* ─────────────────────────────────────────────────────────────────
   SUB-TAB DEFINITIONS
   ───────────────────────────────────────────────────────────────── */

type SubTab = 'workflows' | 'ai-studio';

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────────────────────────── */

export default function VasPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('workflows');
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]!.id);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [showBrowse, setShowBrowse] = useState(false);
  const [browseCategory, setBrowseCategory] = useState<string>('All');
  const [isDragging, setIsDragging] = useState(false);

  // Keep graph reference for potential future use
  void getTemplateGraph;

  const activeInfo = [...TEMPLATES, ...BROWSE_TEMPLATES].find((t) => t.id === activeTemplate);

  // Resize handler for the splitter
  const handleMouseDown = () => {
    setIsDragging(true);
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(260, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const categories = ['All', ...Array.from(new Set(BROWSE_TEMPLATES.map((t) => t.category)))];
  const filteredBrowse = browseCategory === 'All' ? BROWSE_TEMPLATES : BROWSE_TEMPLATES.filter((t) => t.category === browseCategory);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)] overflow-hidden">
        {/* ── SUB-TAB BAR ──────────────────────────────────────────── */}
        <div className="flex items-center gap-0 bg-surface-container-lowest border-b border-surface-container-highest shrink-0 px-4">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-4 py-3 text-label-lg font-semibold transition-colors relative ${
              activeTab === 'workflows'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
            Otto Workflows
          </button>
          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`flex items-center gap-2 px-4 py-3 text-label-lg font-semibold transition-colors relative ${
              activeTab === 'ai-studio'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            Otto AI Studio
          </button>
        </div>

        {/* ── TAB CONTENT ──────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {activeTab === 'workflows' ? (
            <>
              {/* ── LEFT SIDEBAR: Templates ─────────────────────────── */}
              <div
                className="flex flex-col bg-surface-container-lowest border-r border-surface-container-highest shrink-0 overflow-hidden"
                style={{ width: sidebarWidth }}
              >
                {/* Header */}
                <div className="p-4 border-b border-surface-container-highest bg-surface-container-low">
                  <h1 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                    Workflow Templates
                  </h1>
                  <p className="text-label-sm text-on-surface-variant mt-1">Select an industry workflow</p>
                </div>

                {/* Core templates */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-widest px-1 mb-2">
                    ⭐ Popular Templates
                  </p>
                  {TEMPLATES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => { setActiveTemplate(t.id); setShowBrowse(false); }}
                      className={`rounded-xl p-3 cursor-pointer transition-all duration-200 group border ${
                        activeTemplate === t.id && !showBrowse
                          ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/30'
                          : 'border-transparent hover:bg-surface-container-low hover:border-surface-container-highest'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 ${t.bg} rounded-lg flex items-center justify-center shrink-0 ${activeTemplate === t.id ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                          <span className={`material-symbols-outlined text-[20px] ${t.color}`}>{t.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-label-lg font-semibold text-on-surface truncate">{t.name}</h3>
                          <p className="text-label-sm text-on-surface-variant line-clamp-2 mt-0.5">{t.desc}</p>
                          {t.uses && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="material-symbols-outlined text-[12px] text-on-surface-variant/60">group</span>
                              <span className="text-label-sm text-on-surface-variant/60">{t.uses} uses</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Browse All button */}
                  <div className="pt-3 mt-3 border-t border-surface-container-highest">
                    <button
                      onClick={() => setShowBrowse(!showBrowse)}
                      className={`w-full rounded-xl p-3 text-left transition-all border ${
                        showBrowse
                          ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/30'
                          : 'border-transparent hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-secondary">explore</span>
                        </div>
                        <div>
                          <h3 className="text-label-lg font-semibold text-on-surface">Browse All Templates</h3>
                          <p className="text-label-sm text-on-surface-variant">{BROWSE_TEMPLATES.length} more templates</p>
                        </div>
                        <span className={`material-symbols-outlined text-on-surface-variant ml-auto transition-transform ${showBrowse ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </div>
                    </button>

                    {/* Browse templates expandable section */}
                    {showBrowse && (
                      <div className="mt-3 animate-fade-in">
                        {/* Category filter chips */}
                        <div className="flex flex-wrap gap-1.5 px-1 mb-3">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setBrowseCategory(cat)}
                              className={`px-2.5 py-1 rounded-full text-label-sm font-medium transition-all ${
                                browseCategory === cat
                                  ? 'bg-secondary text-on-secondary'
                                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Browse list */}
                        <div className="space-y-1.5">
                          {filteredBrowse.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => { setActiveTemplate(t.id); }}
                              className={`rounded-lg p-2.5 cursor-pointer transition-all border ${
                                activeTemplate === t.id
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-transparent hover:bg-surface-container-low'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 ${t.bg} rounded-md flex items-center justify-center shrink-0`}>
                                  <span className={`material-symbols-outlined text-[16px] ${t.color}`}>{t.icon}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-label-sm font-semibold text-on-surface truncate">{t.name}</h4>
                                  <p className="text-label-sm text-on-surface-variant/70 truncate">{t.desc}</p>
                                </div>
                                {t.uses && (
                                  <span className="text-label-sm text-on-surface-variant/50 shrink-0">{t.uses}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SPLITTER / DRAG HANDLE ──────────────────────────── */}
              <div
                onMouseDown={handleMouseDown}
                className={`w-1.5 shrink-0 cursor-col-resize transition-colors relative group ${
                  isDragging ? 'bg-primary' : 'bg-surface-container-highest hover:bg-primary/40'
                }`}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-4 h-10 rounded-full bg-surface-container-highest group-hover:bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">drag_indicator</span>
                </div>
              </div>

              {/* ── RIGHT: n8n Workflow iframe ──────────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col bg-surface">
                {/* Toolbar */}
                <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-container-highest bg-surface-container-lowest shrink-0">
                  {activeInfo && (
                    <>
                      <div className={`w-7 h-7 ${activeInfo.bg} rounded-md flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-[18px] ${activeInfo.color}`}>{activeInfo.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-label-lg font-semibold text-on-surface truncate">{activeInfo.name}</h2>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-label-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      New Workflow
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1.5 text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[16px]">settings</span>
                      Manage Workflows
                    </button>
                  </div>
                </div>

                {/* n8n iframe */}
                <div className="flex-1 w-full">
                  <iframe
                    src="http://localhost:5678"
                    title="VAS Workflows"
                    style={{ border: 'none', width: '100%', height: '100%' }}
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ── LEFT SIDEBAR: AI Categories ────────────────────── */}
              <div
                className="flex flex-col bg-surface-container-lowest border-r border-surface-container-highest shrink-0 overflow-hidden"
                style={{ width: sidebarWidth }}
              >
                {/* Header */}
                <div className="p-4 border-b border-surface-container-highest bg-surface-container-low">
                  <h1 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                    AI Studio
                  </h1>
                  <p className="text-label-sm text-on-surface-variant mt-1">Build & manage AI agents</p>
                </div>

                {/* AI Category list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-widest px-1 mb-2">
                    🤖 Agent Categories
                  </p>
                  {AI_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-xl p-3 border border-transparent hover:bg-surface-container-low hover:border-surface-container-highest transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 ${cat.bg} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                          <span className={`material-symbols-outlined text-[20px] ${cat.color}`}>{cat.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-label-lg font-semibold text-on-surface truncate">{cat.name}</h3>
                          <p className="text-label-sm text-on-surface-variant line-clamp-2 mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SPLITTER / DRAG HANDLE ──────────────────────────── */}
              <div
                onMouseDown={handleMouseDown}
                className={`w-1.5 shrink-0 cursor-col-resize transition-colors relative group ${
                  isDragging ? 'bg-primary' : 'bg-surface-container-highest hover:bg-primary/40'
                }`}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-4 h-10 rounded-full bg-surface-container-highest group-hover:bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">drag_indicator</span>
                </div>
              </div>

              {/* ── RIGHT: Dify AI Studio iframe ───────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col bg-surface">
                <iframe
                  src="http://localhost:5001"
                  title="Otto AI Studio — Dify"
                  style={{ border: 'none', width: '100%', height: '100%' }}
                  className="flex-1"
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
