'use client';

import React from 'react';

interface WorkflowEmbedProps {
  workflowId?: string;
  className?: string;
}

export function WorkflowEmbed({ workflowId, className = '' }: WorkflowEmbedProps) {
  // If a workflowId is provided, point directly to it; otherwise point to the n8n home
  const embedUrl = workflowId ? `/api/n8n/workflow/${workflowId}` : `/api/n8n/`;

  return (
    <div className={`w-full h-[600px] border border-gray-800 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      <iframe 
        src={embedUrl}
        className="w-full h-full border-none"
        title="Workflow Builder"
        // Sandbox attributes to enhance security if needed, but n8n requires scripts
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
