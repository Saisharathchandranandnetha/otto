'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkflowStudio } from '@/components/workflows/WorkflowStudio';

export default function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || id.replace(/^wf-/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-outline-variant/30 bg-surface shrink-0">
        <button
          onClick={() => router.push('/workflows')}
          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
          title="Back to My Workflows"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">account_tree</span>
        </div>
        <h1 className="text-title-md font-semibold text-on-surface truncate">{name}</h1>
        <span className="text-label-sm text-on-surface-variant hidden sm:block">Workflow Editor</span>
      </div>
      <WorkflowStudio templateId={id} templateName={name} />
    </div>
  );
}
