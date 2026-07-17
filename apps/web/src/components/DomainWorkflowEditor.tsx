'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';

export interface Template {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  category?: string;
  popular?: boolean;
  uses?: string;
}

interface DomainWorkflowEditorProps {
  domainName: string;
  description: string;
  templates: Template[];
}

export function DomainWorkflowEditor({ domainName, description, templates }: DomainWorkflowEditorProps) {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]?.id);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [isDragging, setIsDragging] = useState(false);

  const activeInfo = templates.find((t) => t.id === activeTemplate);

  const handleMouseDown = () => {
    setIsDragging(true);
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(260, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)] overflow-hidden">
        {/* TAB CONTENT */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR: Templates */}
          <div
            className="flex flex-col bg-surface-container-lowest border-r border-surface-container-highest shrink-0 overflow-hidden"
            style={{ width: sidebarWidth }}
          >
            <div className="p-4 border-b border-surface-container-highest bg-surface-container-low">
              <h1 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                {domainName}
              </h1>
              <p className="text-label-sm text-on-surface-variant mt-1">{description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-widest px-1 mb-2">
                ⭐ Pre-built Templates
              </p>
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`rounded-xl p-3 cursor-pointer transition-all duration-200 group border ${
                    activeTemplate === t.id
                      ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/30'
                      : 'border-transparent hover:bg-surface-container-low hover:border-surface-container-highest'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 ${t.bg} rounded-lg flex items-center justify-center shrink-0 ${activeTemplate === t.id ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                      <span className={`material-symbols-outlined text-[20px] ${t.color}`}>{t.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-label-lg font-semibold text-on-surface truncate">{t.name}</h3>
                      <p className="text-label-sm text-on-surface-variant line-clamp-2 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPLITTER / DRAG HANDLE */}
          <div
            onMouseDown={handleMouseDown}
            className={`w-1.5 shrink-0 cursor-col-resize transition-colors relative group ${
              isDragging ? 'bg-primary' : 'bg-surface-container-highest hover:bg-primary/40'
            }`}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-4 h-10 rounded-full bg-surface-container-highest group-hover:bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">drag_indicator</span>
            </div>
          </div>

          {/* RIGHT: n8n Workflow iframe */}
          <div className="flex-1 min-w-0 flex flex-col bg-surface">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-container-highest bg-surface-container-lowest shrink-0">
              {activeInfo && (
                <>
                  <div className={`w-7 h-7 ${activeInfo.bg} rounded-md flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-[18px] ${activeInfo.color}`}>{activeInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-label-lg font-semibold text-on-surface truncate">{activeInfo.name} Workflow Editor</h2>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-label-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  New Node
                </button>
              </div>
            </div>

            {/* n8n iframe */}
            <div className="flex-1 w-full relative">
              {/* Note: In a real system, you'd pass the activeTemplate to the iframe URL or message broker */}
              <iframe
                src={`http://localhost:5678/workflow/new`}
                title={`${domainName} Workflows`}
                style={{ border: 'none', width: '100%', height: '100%' }}
                allow="clipboard-read; clipboard-write"
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
