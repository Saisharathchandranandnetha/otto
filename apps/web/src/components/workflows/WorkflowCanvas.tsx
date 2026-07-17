'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Trigger Node
const TriggerNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-surface border-2 border-primary rounded-lg shadow-sm min-w-[200px] overflow-hidden">
      <div className="bg-primary text-on-primary px-3 py-2 text-label-sm font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">bolt</span>
        {data.label}
      </div>
      <div className="p-3 text-body-sm text-on-surface">
        {data.description || 'Workflow trigger event'}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-primary" />
    </div>
  );
};

// Custom Agent Node
const AgentNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-surface border-2 border-surface-container-highest rounded-lg shadow-sm min-w-[200px] overflow-hidden">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-surface-container-highest" />
      <div className="bg-surface-container-lowest border-b border-surface-container-highest px-3 py-2 text-label-sm font-semibold flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-[16px] text-primary">robot_2</span>
        {data.label}
      </div>
      <div className="p-3">
        <div className="text-body-sm text-on-surface mb-2">{data.task || 'Agent task'}</div>
        <div className="flex flex-wrap gap-1">
          {data.tools?.map((t: string) => (
            <span key={t} className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-surface-container-highest" />
    </div>
  );
};

// Custom Tool Node
const ToolNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-surface border border-surface-container-highest rounded-full shadow-sm pr-4 pl-1 py-1 flex items-center gap-2">
      <Handle type="target" position={Position.Left} className="w-2 h-2 opacity-0" />
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[16px]">{data.icon || 'build'}</span>
      </div>
      <div className="text-label-sm font-medium text-on-surface">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 opacity-0" />
    </div>
  );
};

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'On Email Received', description: 'Triggers when a new invoice email arrives' },
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 250, y: 200 },
    data: { 
      label: 'Invoice Extraction Agent', 
      task: 'Extract structured data from the invoice PDF attached to the email',
      tools: ['PDF Parser', 'Vision Model']
    },
  },
  {
    id: 'agent-2',
    type: 'agent',
    position: { x: 250, y: 380 },
    data: { 
      label: 'PO Matching Agent', 
      task: 'Match extracted line items against open Purchase Orders in the database',
      tools: ['Database Query']
    },
  },
  {
    id: 'tool-db',
    type: 'tool',
    position: { x: 550, y: 410 },
    data: { label: 'Otto Postgres DB', icon: 'database' },
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'trigger-1', target: 'agent-1', animated: true, style: { stroke: '#9aa0a6', strokeWidth: 2 } },
  { id: 'e2-3', source: 'agent-1', target: 'agent-2', animated: true, style: { stroke: '#9aa0a6', strokeWidth: 2 } },
  { id: 'e3-4', source: 'agent-2', target: 'tool-db', animated: true, style: { stroke: '#0F9D58', strokeWidth: 2, strokeDasharray: '5, 5' } },
];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ trigger: TriggerNode, agent: AgentNode, tool: ToolNode }), []);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full bg-[#f8f9fa] rounded-xl border border-surface-container-highest overflow-hidden flex flex-col">
      <div className="p-4 bg-surface border-b border-surface-container-highest flex items-center justify-between z-10">
        <div>
          <h2 className="text-title-md font-semibold text-on-surface">Invoice Processing Pipeline</h2>
          <p className="text-body-sm text-on-surface-variant">Otto Workflow Builder</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-label-md font-medium hover:bg-surface-container-highest transition-colors">
            Test Workflow
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">publish</span>
            Deploy
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#f8f9fa]"
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
