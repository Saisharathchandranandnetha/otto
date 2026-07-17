import React from 'react';
import { Bot, MessageCircle, Brain, FileText, Workflow, Sparkles } from 'lucide-react';
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
  title: 'VAS Domain | Otto',
};

export default async function VasDashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
      {/* 1. Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-2">
          <span>Otto</span>
          <span>→</span>
          <span className="font-medium text-on-surface">VAS Domain</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-display-sm font-semibold text-on-surface">VAS AI Control Center</h1>
            <p className="text-body-md text-on-surface-variant mt-1">Live monitoring across all 6 AI pillars</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/vas/workflows" className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-1.5 rounded-lg text-label-md font-medium transition-colors">
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
          title="AI Service Copilot"
          primaryMetric="105 hrs"
          secondaryMetric="56 ticket routings automated"
          icon={Bot}
          trendUp={true}
        />
        <MetricPillarCard 
          title="AI Tech Support"
          primaryMetric="214 queries"
          secondaryMetric="78% resolved without human"
          icon={MessageCircle}
          trendUp={true}
        />
        <MetricPillarCard 
          title="AI Knowledge Base"
          primaryMetric="96% accuracy"
          secondaryMetric="Top topic: Setup Guide (88)"
          icon={Brain}
          trendUp={true}
        />
        <MetricPillarCard 
          title="AI SLA Generation"
          primaryMetric="32 docs"
          secondaryMetric="15 SLAs • 17 Incident Reports"
          icon={FileText}
          trendUp={true}
        />
        <MetricPillarCard 
          title="Autonomous Service Agents"
          primaryMetric="9 active"
          secondaryMetric="45 dispatch pipelines completed"
          icon={Workflow}
        />
        <MetricPillarCard 
          title="Churn Prediction Engine"
          primaryMetric="12 alerts"
          secondaryMetric="4 at-risk accounts detected"
          icon={Sparkles}
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
