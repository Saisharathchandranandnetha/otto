'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Sidebar } from '../../../../components/Sidebar';
import { Bot, Plus, Settings, Play, Shield } from 'lucide-react';
import { AgentBuilderWizard } from '../../../../components/AgentBuilderWizard';
import { LiquidGlass } from '../../../../components/synapse/LiquidGlass';
import { SentientSphere } from '../../../../components/synapse/SentientSphere';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AgentsPage() {
  const { data, error, isLoading } = useSWR('/api/v1/agents', fetcher);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const agents = data?.data || [];
  const selectedAgent = agents.find((a: any) => a.id === selectedAgentId);

  return (
    <div className="flex h-screen bg-surface-container-lowest text-on-surface">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Agent List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-outline-variant/30 bg-surface flex flex-col">
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <h1 className="text-title-lg font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Agents
            </h1>
            <button 
              onClick={() => setShowWizard(true)}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-primary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="text-on-surface-variant text-center py-8">Loading agents...</div>
            ) : error ? (
              <div className="text-error text-center py-8">Failed to load agents.</div>
            ) : agents.length === 0 ? (
              <div className="text-on-surface-variant text-center py-8">No agents found. Create one to get started.</div>
            ) : (
              agents.map((agent: any) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedAgentId === agent.id 
                      ? 'bg-primary-container/20 border-primary shadow-sm' 
                      : 'bg-surface border-outline-variant/30 hover:border-outline hover:bg-surface-container-low'
                  }`}
                >
                  <div className="font-medium text-title-md">{agent.name}</div>
                  <div className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {agent.system_prompt || 'No description provided.'}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                      {agent.model_config?.model || 'default-model'}
                    </span>
                    <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      L{agent.autonomy_level}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <LiquidGlass className="flex-1 flex flex-col border-l border-outline-variant/30 rounded-none">
          {selectedAgent ? (
            <>
              <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface/50 backdrop-blur-md">
                <div>
                  <h2 className="text-display-sm font-semibold">{selectedAgent.name}</h2>
                  <p className="text-body-md text-on-surface-variant mt-1">Configure and monitor this agent.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline hover:bg-surface-container-low rounded-lg transition-colors font-medium">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg transition-colors font-medium">
                    <Play className="w-4 h-4" />
                    Test Agent
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* System Prompt Card */}
                  <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-title-md font-semibold mb-4">System Prompt</h3>
                    <div className="bg-surface-container-low p-4 rounded-xl text-body-md whitespace-pre-wrap font-mono text-sm">
                      {selectedAgent.system_prompt}
                    </div>
                  </div>
                  
                  {/* Capabilities Card */}
                  <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-title-md font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-secondary" />
                      Trust & Autonomy
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-outline-variant/30 rounded-xl bg-surface-container-lowest">
                        <div className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Autonomy Level</div>
                        <div className="text-title-lg font-medium">Level {selectedAgent.autonomy_level}</div>
                        <div className="text-body-sm text-on-surface-variant mt-1">
                          {selectedAgent.autonomy_level >= 3 ? 'Requires Quorum' : 'Human in the Loop'}
                        </div>
                      </div>
                      <div className="p-4 border border-outline-variant/30 rounded-xl bg-surface-container-lowest">
                        <div className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Allowed Tools</div>
                        <div className="text-title-lg font-medium">
                          {selectedAgent.allowed_tools?.length || 0} configured
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
              <div className="w-64 h-64 mb-4">
                <SentientSphere />
              </div>
              <p className="text-title-md">Select an agent to view details</p>
            </div>
          )}
        </LiquidGlass>
      </main>
      
      {showWizard && <AgentBuilderWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
