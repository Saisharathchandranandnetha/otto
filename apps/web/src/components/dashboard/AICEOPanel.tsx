import React from 'react';
import { BrainCircuit, CheckCircle2, Zap, Clock, LineChart } from 'lucide-react';

export function AICEOPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface border border-amber-500/30 shadow-sm p-4 mb-6">
      {/* Animated gradient border effect via pseudo-element conceptually - handled here with a subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-50 pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Brain Status */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="text-amber-500 animate-pulse" size={20} />
            <h2 className="text-label-lg font-bold text-on-surface">AI Brain Status</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
              Analyzing
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant font-medium">
            "Admission season detected. 40% query spike vs last week."
          </p>
        </div>

        {/* Middle: Sequence Chips */}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded">
            <CheckCircle2 size={12} /> Intent Understood
          </div>
          <div className="text-outline-variant">→</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded">
            <CheckCircle2 size={12} /> Data Analyzed
          </div>
          <div className="text-outline-variant">→</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded">
            <Zap size={12} /> Action Planned
          </div>
          <div className="text-outline-variant">→</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded animate-pulse">
            <Clock size={12} /> Awaiting Approval
          </div>
          <div className="text-outline-variant">→</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30 px-2 py-1 rounded opacity-50">
            <LineChart size={12} /> Learning
          </div>
        </div>

        {/* Right: Action */}
        <div className="flex-shrink-0 bg-surface-container-lowest border border-amber-500/30 p-3 rounded-lg shadow-sm">
          <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">Recommended Action</p>
          <p className="text-label-sm text-on-surface font-semibold mb-3">
            Send bulk announcement about admission deadline
          </p>
          <div className="flex items-center gap-2">
            <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-label-sm font-medium py-1.5 px-3 rounded transition">
              Execute
            </button>
            <button className="flex-1 bg-surface hover:bg-surface-container border border-outline-variant/50 text-on-surface text-label-sm font-medium py-1.5 px-3 rounded transition">
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
