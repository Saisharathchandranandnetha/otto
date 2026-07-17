'use client';
import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, Clock, XCircle, RotateCw } from 'lucide-react';

export function AutomationJobsPanel() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/education/n8n-status');
      const data = await res.json();
      
      if (data.recent_executions && data.recent_executions.length > 0) {
        const mappedJobs = data.recent_executions.map((ex: any, idx: number) => ({
          id: ex.id,
          name: ex.workflowId === data.workflow_id ? "Telegram Chat Integration" : `Workflow ${ex.workflowId}`,
          trigger: "Webhook",
          status: ex.status,
          time: ex.startedAt ? new Date(ex.startedAt).toLocaleTimeString() : 'Unknown',
          detail: ex.mode
        }));
        setJobs(mappedJobs.slice(0, 4)); // Only show top 4
      } else {
        // Fallback or empty state
        setJobs([]);
      }
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-amber-500" size={20} />
          <h2 className="text-label-lg font-semibold text-on-surface">Automation Jobs Feed (n8n Live)</h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
          <RotateCw size={12} className={isRefreshing ? "animate-spin" : ""} /> Auto-refreshes (10s)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.length === 0 ? (
          <div className="col-span-4 text-center py-4 text-on-surface-variant text-body-sm">
            No automation jobs running or n8n is unreachable.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="p-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                  {job.status === 'success' && <CheckCircle2 size={14} className="text-green-500" />}
                  {job.status === 'running' && <Clock size={14} className="text-amber-500 animate-pulse" />}
                  {(job.status === 'error' || job.status === 'canceled') && <XCircle size={14} className="text-red-500" />}
                  {job.status === 'waiting' && <Clock size={14} className="text-blue-500" />}
                  <span className="text-label-sm font-semibold text-on-surface line-clamp-1">{job.name}</span>
                </div>
              </div>
              
              <div className="space-y-1 mb-3">
                <p className="text-[10px] text-on-surface-variant flex items-center justify-between">
                  <span>Trigger:</span> <span className="font-medium text-on-surface">{job.trigger}</span>
                </p>
                <p className="text-[10px] text-on-surface-variant flex items-center justify-between">
                  <span>Started:</span> <span className="font-medium text-on-surface">{job.time}</span>
                </p>
              </div>

              <div className={`text-[11px] font-medium p-2 rounded flex items-center justify-between ${
                job.status === 'error' ? 'bg-red-500/10 text-red-500' :
                job.status === 'running' ? 'bg-amber-500/10 text-amber-500' :
                'bg-surface-container text-on-surface-variant'
              }`}>
                <span className="line-clamp-1">{job.detail}</span>
                {job.status === 'error' && (
                  <button className="shrink-0 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider hover:bg-red-600 transition">
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
