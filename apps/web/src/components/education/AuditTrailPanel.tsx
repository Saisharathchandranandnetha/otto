import React from 'react';
import { History, Download, FileSpreadsheet } from 'lucide-react';

export function AuditTrailPanel() {
  const auditLogs = [
    { id: 1, time: "2:34 PM", action: "Sent fee reminder", trigger: "Automation Engine", module: "AI Customer Support", status: "Executed", approvedBy: "Auto-approved" },
    { id: 2, time: "2:28 PM", action: "Generated question paper", trigger: "AI Document Gen", module: "Document Module", status: "Executed", approvedBy: "Principal (manual)" },
    { id: 3, time: "2:15 PM", action: "Attempted bulk SMS", trigger: "AI CEO", module: "Notification Module", status: "Pending", approvedBy: "Awaiting approval" },
    { id: 4, time: "1:45 PM", action: "Identified 3 at-risk students", trigger: "AI Personalization", module: "Analytics Module", status: "Executed", approvedBy: "System" },
    { id: 5, time: "1:12 PM", action: "Updated admission FAQs", trigger: "Knowledge Sync", module: "AI Knowledge Assistant", status: "Executed", approvedBy: "Auto-approved" },
  ];

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <div className="flex items-center gap-2">
          <History className="text-amber-500" size={20} />
          <h2 className="text-label-lg font-semibold text-on-surface">Audit Trail</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-[11px] font-medium bg-surface hover:bg-surface-container border border-outline-variant/50 text-on-surface px-2 py-1.5 rounded transition">
            <Download size={12} /> PDF
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-medium bg-surface hover:bg-surface-container border border-outline-variant/50 text-on-surface px-2 py-1.5 rounded transition">
            <FileSpreadsheet size={12} /> Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-lowest text-on-surface-variant text-[11px] uppercase border-b border-outline-variant/30">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Triggered By</th>
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Approved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-body-sm text-on-surface">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-surface-container-lowest transition">
                <td className="px-4 py-3 whitespace-nowrap text-on-surface-variant text-[11px]">{log.time}</td>
                <td className="px-4 py-3 font-medium">{log.action}</td>
                <td className="px-4 py-3 text-on-surface-variant">{log.trigger}</td>
                <td className="px-4 py-3 text-on-surface-variant">{log.module}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    log.status === 'Executed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {log.status === 'Executed' ? '✅ ' : '⏳ '}{log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-on-surface-variant">{log.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
