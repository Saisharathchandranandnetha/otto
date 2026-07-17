'use client';
import React, { useState } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "3 fee payments overdue — auto-reminder sent", type: "info", icon: Bell },
    { id: 2, text: "Bot confidence below 70% on 2 queries — knowledge base may need update", type: "warning", icon: AlertTriangle },
    { id: 3, text: "Admission pipeline completed for Student #1089", type: "success", icon: CheckCircle },
    { id: 4, text: "Weekly report ready — click to download", type: "report", icon: BarChart2 }
  ]);

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications([]);
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'success': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'report': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-on-surface-variant bg-surface-container border-outline-variant/20';
    }
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 relative">
          <Bell className="text-amber-500" size={20} />
          <h2 className="text-label-lg font-semibold text-on-surface">Notifications</h2>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -left-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-surface">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button onClick={markAllRead} className="text-[10px] text-on-surface-variant hover:text-on-surface transition font-medium underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-body-sm opacity-60">
            <Bell size={24} className="mb-2" />
            <p>All caught up!</p>
          </div>
        ) : (
          notifications.map(notif => {
            const Icon = notif.icon;
            const style = getStyle(notif.type);
            return (
              <div key={notif.id} className="relative group p-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest flex items-start gap-3 hover:border-outline-variant/50 transition pr-8">
                <div className={`p-1.5 rounded-full shrink-0 border ${style}`}>
                  <Icon size={14} />
                </div>
                <p className="text-[11px] text-on-surface leading-snug mt-0.5">{notif.text}</p>
                <button 
                  onClick={() => dismiss(notif.id)}
                  className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded transition opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
