import React from 'react';

export function WorkflowStatusTracker() {
  const pipelines = [
    {
      id: 1,
      name: 'Admission Approval Pipeline',
      steps: ['Receive App', 'Verify Docs', 'AI Score', 'Principal Review', 'Send Letter'],
      currentStep: 3,
      lastRun: '2 mins ago',
      status: 'running'
    },
    {
      id: 2,
      name: 'Fee Reminder Chain',
      steps: ['Identify Overdue', 'Generate Notice', 'Send Telegram', 'Log Response'],
      currentStep: 4,
      lastRun: '15 mins ago',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Exam Schedule Publisher',
      steps: ['Compile Timetable', 'Generate PDFs', 'Notify Students', 'Archive'],
      currentStep: 0,
      lastRun: '1 day ago',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full mt-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚙️</span>
        <h2 className="text-label-lg font-semibold text-on-surface">Active Workflow Agents</h2>
      </div>

      <div className="space-y-6">
        {pipelines.map(pipeline => (
          <div key={pipeline.id}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-label-md text-on-surface font-medium">{pipeline.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant">Last run: {pipeline.lastRun}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  pipeline.status === 'running' ? 'bg-amber-500/10 text-amber-500' :
                  pipeline.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                  'bg-surface-container text-on-surface-variant'
                }`}>
                  {pipeline.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-outline-variant/30 -z-10" />
              
              {pipeline.steps.map((step, idx) => {
                const isCompleted = idx < pipeline.currentStep || pipeline.status === 'completed';
                const isCurrent = idx === pipeline.currentStep && pipeline.status === 'running';
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 group relative bg-surface">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      isCompleted ? 'bg-green-500 border-green-500' :
                      isCurrent ? 'bg-amber-500 border-amber-500 ring-2 ring-amber-500/30' :
                      'bg-surface-container border-outline-variant/50'
                    }`} />
                    
                    {/* Tooltip on hover for step name */}
                    <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-on-surface text-surface text-[10px] px-2 py-1 rounded z-10 pointer-events-none">
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
