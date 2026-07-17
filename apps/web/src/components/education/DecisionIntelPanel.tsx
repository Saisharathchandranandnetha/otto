import React from 'react';
import { AlertTriangle, Info, ShieldAlert, CheckCircle } from 'lucide-react';

export function DecisionIntelPanel() {
  const insights = [
    {
      id: 1,
      type: 'warning',
      text: "40% of today's Telegram queries are about 10th grade admission deadlines. Consider sending a bulk announcement.",
      action: "Send Announcement"
    },
    {
      id: 2,
      type: 'alert',
      text: "3 students show fragmented exam-prep query patterns — possible at-risk learners.",
      action: "View Students"
    },
    {
      id: 3,
      type: 'info',
      text: "Fee payment reminder workflow has 11 pending approvals.",
      action: "Review Queue"
    },
    {
      id: 4,
      type: 'success',
      text: "AI resolved 71/89 queries without human intervention today. +8% vs yesterday.",
      action: "View Report"
    }
  ];

  const getStyle = (type: string) => {
    switch(type) {
      case 'alert': return { border: 'border-red-500', bg: 'bg-red-500/10', icon: <ShieldAlert size={16} className="text-red-500 mt-0.5 shrink-0" /> };
      case 'warning': return { border: 'border-amber-500', bg: 'bg-amber-500/10', icon: <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" /> };
      case 'success': return { border: 'border-green-500', bg: 'bg-green-500/10', icon: <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> };
      default: return { border: 'border-blue-500', bg: 'bg-blue-500/10', icon: <Info size={16} className="text-blue-500 mt-0.5 shrink-0" /> };
    }
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧠</span>
        <h2 className="text-label-lg font-semibold text-on-surface">AI Decision Assistant</h2>
      </div>

      <div className="space-y-3">
        {insights.map(insight => {
          const style = getStyle(insight.type);
          return (
            <div key={insight.id} className="relative overflow-hidden border border-outline-variant/30 bg-surface-container-lowest rounded-lg p-3 hover:border-outline-variant/50 transition">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg.replace('/10', '')}`} />
              
              <div className="flex gap-2 pl-2">
                {style.icon}
                <div>
                  <p className="text-body-sm text-on-surface mb-2">{insight.text}</p>
                  <button className="text-[10px] font-medium uppercase px-2 py-1 border border-amber-500 text-amber-500 hover:bg-amber-500/10 rounded transition">
                    {insight.action}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
