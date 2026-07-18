import React from 'react';
import { Headphones, MessageSquare, BrainCircuit, BookOpen, Clock, Workflow } from 'lucide-react';
import { MetricPillarCard } from '@/components/dashboard/MetricPillarCard';
import { TelegramLiveFeed } from '@/components/dashboard/TelegramLiveFeed';
import { DecisionIntelPanel } from '@/components/dashboard/DecisionIntelPanel';
import { WorkflowStatusTracker } from '@/components/dashboard/WorkflowStatusTracker';
import { DocumentGenPanel } from '@/components/dashboard/DocumentGenPanel';
import { PersonalizationPanel } from '@/components/dashboard/PersonalizationPanel';
import { AICEOPanel } from '@/components/dashboard/AICEOPanel';
import { TrustGatePanel } from '@/components/dashboard/TrustGatePanel';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { KPIChartsPanel } from '@/components/dashboard/KPIChartsPanel';
import { AutomationJobsPanel } from '@/components/dashboard/AutomationJobsPanel';
import { AuditTrailPanel } from '@/components/dashboard/AuditTrailPanel';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';

export const metadata = {
  title: 'Support Domain | Otto',
};

export default async function SupportDashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
      {/* 1. Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-2">
          <span>Otto</span>
          <span>→</span>
          <span className="font-medium text-on-surface">Support Domain</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-display-sm font-semibold text-on-surface">Support AI Control Center</h1>
            <p className="text-body-md text-on-surface-variant mt-1">Live monitoring across all 6 AI pillars</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/support/workflows" className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-1.5 rounded-lg text-label-md font-medium transition-colors">
              Open Workflows
            </a>
            <div className="flex items-center gap-2 bg-surface border border-outline-variant/30 px-3 py-1.5 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-label-sm font-bold text-on-surface tracking-wide">SYSTEM LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI CEO Command Center Banner */}
      <AICEOPanel />

      {/* 3. Top Row - 6 Pillar Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricPillarCard 
          title="Ticket Triage AI"
          primaryMetric="4,321 tickets"
          secondaryMetric="89% auto-categorized today"
          icon={Headphones}
          trendUp={true}
        />
        <MetricPillarCard 
          title="Customer Sentiment"
          primaryMetric="94% Positive"
          secondaryMetric="12 escalations required"
          icon={MessageSquare}
          trendUp={false}
        />
        <MetricPillarCard 
          title="Resolution Agent"
          primaryMetric="2m 14s Avg"
          secondaryMetric="Resolution time down 30s"
          icon={Clock}
          trendUp={true}
        />
        <MetricPillarCard 
          title="Knowledge Base Gen"
          primaryMetric="14 articles"
          secondaryMetric="Auto-drafted from solved tickets"
          icon={BookOpen}
          trendUp={true}
        />
        <MetricPillarCard 
          title="Autonomous Support Agents"
          primaryMetric="12 active"
          secondaryMetric="56 workflows completed today"
          icon={Workflow}
        />
        <MetricPillarCard 
          title="Response Personalization"
          primaryMetric="1.2k tailored"
          secondaryMetric="14% higher CSAT on tailored responses"
          icon={BrainCircuit}
          trendUp={true}
        />
      </div>

      {/* 4. 3-column row: TelegramLiveFeed (50%) | TrustGatePanel (25%) | NotificationsPanel (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 h-[600px]">
        <div className="lg:col-span-2">
          <TelegramLiveFeed />
        </div>
        <div className="lg:col-span-1">
          <TrustGatePanel />
        </div>
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>

      {/* 5. 2-column row: KPIChartsPanel (60%) | WorkflowStatusTracker (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <KPIChartsPanel />
        </div>
        <div className="lg:col-span-2">
          <WorkflowStatusTracker />
        </div>
      </div>

      {/* 6. 2-column row: DocumentGenPanel (50%) | PersonalizationPanel (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DocumentGenPanel />
        <PersonalizationPanel />
      </div>

      {/* 7. Automation Jobs Panel */}
      <AutomationJobsPanel />

      {/* 8. Activity Timeline */}
      <ActivityTimeline />

      {/* 9. Audit Trail (Bottom) */}
      <AuditTrailPanel />
      
    </div>
  );
}
