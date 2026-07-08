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

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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

  return (
    <div className="w-full h-full flex flex-col bg-surface">
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
          <span className="text-label-sm text-secondary bg-secondary-container/30 px-2 py-1 rounded">Draft</span>
          <button className="btn-primary py-1.5 px-4 text-label-sm">
            Publish Workflow
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
  );
}
