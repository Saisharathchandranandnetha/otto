'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Trigger: Customer Message' },
    position: { x: 250, y: 5 },
    style: { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '2',
    data: { label: 'LLM Node: Extract Intent & Entities' },
    position: { x: 250, y: 100 },
    style: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '3',
    data: { label: 'Decision: Needs Approval?' },
    position: { x: 250, y: 200 },
    style: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Vas Action Execution' },
    position: { x: 250, y: 300 },
    style: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'Approved' },
];

type WorkflowBuilderProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

export function WorkflowBuilder({ initialNodes, initialEdges }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [published, setPublished] = useState(false);

  const [chatState, setChatState] = useState<'idle' | 'generating' | 'done'>('idle');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const handleGenerateTemplate = () => {
    setChatState('generating');
    
    // Simulate AI generation time
    setTimeout(() => {
      setNodes([
        { id: 'a1', type: 'input', position: { x: 50, y: 50 }, style: { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', width: 220 }, data: { label: '🚀 Trigger: New User Signup' } },
        { id: 'a2', position: { x: 50, y: 150 }, style: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px', width: 220 }, data: { label: '🤖 LLM: Draft Welcome Msg' } },
        { id: 'a3', position: { x: 50, y: 250 }, style: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px', width: 220 }, data: { label: '💬 Twilio SMS API' } },
        { id: 'a4', type: 'output', position: { x: 50, y: 350 }, style: { background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '10px', width: 220 }, data: { label: '👤 Manager Approval Gate' } },
      ]);
      setEdges([
        { id: 'e1', source: 'a1', target: 'a2', animated: true },
        { id: 'e2', source: 'a2', target: 'a3', animated: true },
        { id: 'e3', source: 'a3', target: 'a4' },
      ]);
      setChatState('done');
    }, 1500);
  };

  return (
    <div className="w-full h-full flex bg-surface overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Builder Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container-highest bg-surface-container-lowest">
          <div className="flex items-center gap-4">
            <h2 className="text-label-lg font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_tree</span>
              Vas Workflow Builder
            </h2>
            <div className="h-4 w-px bg-surface-container-highest"></div>
            <button className="text-label-sm flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">add_circle</span> Add Node
            </button>
            <button className="text-label-sm flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span> LLM
            </button>
            <button className="text-label-sm flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">call_split</span> Logic
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-label-sm px-2 py-1 rounded ${published ? 'text-green-700 bg-green-100' : 'text-secondary bg-secondary-container/30'}`}>
              {published ? 'Published' : 'Draft'}
            </span>
            <button 
              className="btn-primary py-1.5 px-4 text-label-sm transition-colors"
              onClick={() => {
                setPublished(true);
                setTimeout(() => setPublished(false), 3000);
              }}
            >
              {published ? (
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check</span> Done</span>
              ) : (
                'Publish Workflow'
              )}
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 w-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <Background color="#e2e8f0" gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* AI Copilot Sidebar */}
      <div className="w-80 border-l border-surface-container-highest bg-surface-container-lowest flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-container-highest flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">temp_preferences_custom</span>
          <h3 className="font-semibold text-label-lg text-on-surface">Otto Workflow AI</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-primary">robot_2</span>
            </div>
            <div className="bg-surface border border-surface-container-highest rounded-2xl rounded-tl-sm p-3 text-body-sm text-on-surface">
              <p>Hi! I can generate custom automation templates for you. What would you like to build?</p>
              
              {chatState === 'idle' && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="text-label-sm text-on-surface-variant font-medium">Suggested:</p>
                  <button 
                    onClick={handleGenerateTemplate}
                    className="text-left bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg p-2 text-primary transition-colors"
                  >
                    ✨ Generate a Customer Onboarding Workflow via SMS
                  </button>
                </div>
              )}
            </div>
          </div>

          {chatState === 'generating' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
              </div>
              <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-3 text-body-sm self-end">
                Generate a Customer Onboarding Workflow via SMS
              </div>
            </div>
          )}

          {(chatState === 'generating' || chatState === 'done') && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-primary">robot_2</span>
              </div>
              <div className="bg-surface border border-surface-container-highest rounded-2xl rounded-tl-sm p-3 text-body-sm text-on-surface">
                {chatState === 'generating' ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Building flow...
                  </span>
                ) : (
                  <div className="space-y-3">
                    <p>✅ <strong>Template Generated!</strong></p>
                    <p>I've added the Customer Onboarding flow to your canvas.</p>
                    <div className="bg-error/10 border border-error/20 p-2 rounded-lg text-error">
                      <p className="font-semibold flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-[16px]">lock</span> Configuration Required
                      </p>
                      <p>To make this live, you must click on the <strong>Twilio SMS API</strong> node and configure your confidential data:</p>
                      <ul className="list-disc list-inside mt-1 ml-1">
                        <li><code>TWILIO_ACCOUNT_SID</code></li>
                        <li><code>TWILIO_AUTH_TOKEN</code></li>
                        <li>Target <strong>Mobile Number</strong></li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-surface-container-highest">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask Otto to build a workflow..." 
              className="w-full bg-surface border border-outline-variant/50 rounded-full pl-4 pr-10 py-2 text-body-sm focus:outline-none focus:border-primary"
              disabled
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
