'use client';
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

export function TrustGatePanel() {
  const [pending, setPending] = useState([
    { id: 1, text: "Send bulk Telegram message to 847 parents about admission deadline", risk: "Medium" },
    { id: 2, text: "Auto-generate and send 23 fee invoices", risk: "Low" },
    { id: 3, text: "Escalate 3 unresolved queries to human staff", risk: "Low" }
  ]);
  
  const [executed, setExecuted] = useState([
    { id: 4, text: "Sync daily attendance records to DB", type: "approved" }
  ]);

  const handleAction = (id: number, type: 'approve' | 'reject') => {
    const item = pending.find(i => i.id === id);
    if (!item) return;
    setPending(prev => prev.filter(i => i.id !== id));
    setExecuted(prev => [{ id: item.id, text: item.text, type: type === 'approve' ? 'approved' : 'rejected' }, ...prev]);
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-amber-500" size={20} />
          <h2 className="text-label-lg font-semibold text-on-surface">Trust Gate</h2>
        </div>
        <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
          {pending.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {pending.length > 0 ? pending.map(item => (
          <div key={item.id} className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 group">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                item.risk === 'High' ? 'bg-red-500/10 text-red-500' : 
                item.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                'bg-blue-500/10 text-blue-500'
              }`}>
                {item.risk} Risk
              </span>
            </div>
            <p className="text-body-sm text-on-surface mb-3 font-medium leading-snug">{item.text}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(item.id, 'approve')}
                className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-[11px] font-semibold py-1.5 rounded transition"
              >
                <Check size={14} /> Approve
              </button>
              <button 
                onClick={() => handleAction(item.id, 'reject')}
                className="flex-1 flex items-center justify-center gap-1 bg-surface hover:bg-surface-container border border-outline-variant/50 text-on-surface text-[11px] font-semibold py-1.5 rounded transition"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-4 text-on-surface-variant text-body-sm">
            No pending actions to review.
          </div>
        )}

        {executed.length > 0 && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30">
            <h3 className="text-label-sm font-semibold text-on-surface-variant mb-3">Recently Processed</h3>
            <div className="space-y-2 opacity-60">
              {executed.map(item => (
                <div key={item.id} className="p-2 rounded border border-outline-variant/20 bg-surface-container-lowest flex items-start gap-2">
                  {item.type === 'approved' ? (
                    <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-[11px] text-on-surface line-clamp-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
