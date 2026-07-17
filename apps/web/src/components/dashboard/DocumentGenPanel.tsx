import React from 'react';
import { FileText, Download } from 'lucide-react';

export function DocumentGenPanel() {
  const recentDocs = [
    { id: 1, name: 'Mid-term Physics Paper v2', type: 'Question Paper', time: '10 mins ago' },
    { id: 2, name: 'Fee Invoice - John Doe', type: 'Invoice', time: '1 hour ago' },
    { id: 3, name: 'Admit Card - Class 10A', type: 'Admit Card', time: '3 hours ago' },
    { id: 4, name: 'Transport Route Change Notice', type: 'Notice', time: '5 hours ago' },
    { id: 5, name: 'PTA Meeting Agenda', type: 'Report', time: '1 day ago' },
  ];

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📄</span>
          <h2 className="text-label-lg font-semibold text-on-surface">AI Document Generation</h2>
        </div>
        <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-label-sm font-medium hover:bg-amber-600 transition shadow-sm">
          Generate New
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Simple mock chart visualization */}
        <div className="flex items-center justify-center p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg">
          <div className="flex gap-4 items-center">
            <div className="relative w-24 h-24 rounded-full border-8 border-amber-500/20 flex items-center justify-center">
              {/* Fake donut segments */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-amber-500 border-r-amber-500 rotate-45" />
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-blue-500 -rotate-12" />
              <div className="text-center">
                <span className="block text-headline-sm font-bold text-on-surface leading-none">23</span>
                <span className="block text-[10px] text-on-surface-variant">Today</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-label-sm">
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-on-surface-variant">Invoices (11)</span>
              </div>
              <div className="flex items-center gap-2 text-label-sm">
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <span className="text-on-surface-variant">Admit Cards (7)</span>
              </div>
              <div className="flex items-center gap-2 text-label-sm">
                <div className="w-3 h-3 rounded-sm bg-amber-500/20" />
                <span className="text-on-surface-variant">Q. Papers (5)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-label-sm font-semibold text-on-surface mb-2">Recent Documents</h3>
          <div className="space-y-2">
            {recentDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-label-sm font-medium text-on-surface line-clamp-1">{doc.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.time}</span>
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-amber-500 opacity-0 group-hover:opacity-100 transition p-1">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
