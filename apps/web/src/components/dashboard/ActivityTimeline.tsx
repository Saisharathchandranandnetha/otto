'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function ActivityTimeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const timelineEvents = [
    { 
      id: 1, 
      time: "2 mins ago", 
      title: "Admission Deadline Inquiry",
      currentStep: 5,
      details: "User asked about deadline. AI identified topic, prepared bulk announcement recommendation, approved by system, and executed."
    },
    { 
      id: 2, 
      time: "15 mins ago", 
      title: "Fee Reminder Generation",
      currentStep: 5,
      details: "Triggered by Automation Engine. Analyzed 200 accounts. Generated 47 notices."
    },
    { 
      id: 3, 
      time: "28 mins ago", 
      title: "Bulk SMS Broadcast",
      currentStep: 3,
      details: "AI prepared SMS broadcast for transport route change. Awaiting Principal approval."
    },
    { 
      id: 4, 
      time: "1 hour ago", 
      title: "Exam Timetable Draft",
      currentStep: 2,
      details: "AI currently analyzing syllabus coverage to draft exam timetable."
    }
  ];

  const steps = ['Business Event', 'AI Brain', 'AI Analyzes', 'Action Prepared', 'Human Review', 'Executed'];

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm mb-6">
      <h2 className="text-label-lg font-semibold text-on-surface mb-6">Live Activity Timeline</h2>

      <div className="space-y-4">
        {timelineEvents.map((event) => (
          <div key={event.id} className="relative pl-4 border-l border-outline-variant/30">
            {/* Timeline dot */}
            <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 bg-surface ${
              event.currentStep === 5 ? 'border-green-500' : 'border-amber-500'
            }`} />
            
            <div 
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 cursor-pointer hover:border-outline-variant/50 transition group"
              onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-label-sm font-semibold text-on-surface">{event.title}</h3>
                  <p className="text-[10px] text-on-surface-variant">{event.time}</p>
                </div>
                <button className="text-on-surface-variant opacity-50 group-hover:opacity-100 transition">
                  {expandedId === event.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Sequence path */}
              <div className="flex flex-wrap items-center gap-1 mt-3">
                {steps.map((step, idx) => {
                  const isCompleted = idx < event.currentStep;
                  const isCurrent = idx === event.currentStep;
                  const isFuture = idx > event.currentStep;
                  
                  return (
                    <React.Fragment key={step}>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        isCompleted ? 'bg-green-500/10 text-green-500' :
                        isCurrent ? 'bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20' :
                        'bg-surface-container text-on-surface-variant opacity-50'
                      }`}>
                        {step}
                      </span>
                      {idx < steps.length - 1 && (
                        <span className="text-[10px] text-outline-variant">→</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Expanded details */}
              {expandedId === event.id && (
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-body-sm text-on-surface-variant">
                  {event.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
