'use client';

import { Sidebar } from '../../../../components/Sidebar';
import { FileText, Plus } from 'lucide-react';

export default function PromptsPage() {
  return (
    <div className="flex h-screen bg-surface-container-lowest text-on-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-sm font-semibold flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Prompts
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-2">
              Manage system prompts and templates for your agents.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg transition-colors font-medium">
            <Plus className="w-5 h-5" />
            New Prompt
          </button>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-2xl flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h2 className="text-title-lg font-medium">No Prompts Yet</h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Create a prompt template to share across agents.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
