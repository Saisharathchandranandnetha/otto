import React, { useState } from 'react';
import { Bot, Shield, Wrench, CheckCircle, Database } from 'lucide-react';

const steps = [
  { id: 1, name: 'Identity', icon: Bot },
  { id: 2, name: 'Knowledge', icon: Database },
  { id: 3, name: 'Tools', icon: Wrench },
  { id: 4, name: 'Trust & Autonomy', icon: Shield },
  { id: 5, name: 'Review', icon: CheckCircle },
];

export function AgentBuilderWizard({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    knowledgeSources: [] as string[],
    tools: [] as string[],
    autonomyLevel: 1,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSave = async () => {
    // In production, this would POST to /api/v1/agents
    console.log('Saving agent:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Steps */}
        <div className="bg-surface border-b border-outline-variant/30 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-display-sm font-semibold">Create New Agent</h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              Close
            </button>
          </div>
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant/30 -z-10 -translate-y-1/2" />
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-surface px-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary text-on-primary' :
                    isPast ? 'bg-primary-container text-on-primary-container' :
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-label-sm font-medium ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-title-lg font-semibold">Agent Identity</h3>
              <p className="text-body-md text-on-surface-variant">Define who this agent is and its core purpose.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-label-md font-medium mb-1">Agent Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Lead Support Agent"
                  />
                </div>
                <div>
                  <label className="block text-label-md font-medium mb-1">Description</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Brief description of responsibilities"
                  />
                </div>
                <div>
                  <label className="block text-label-md font-medium mb-1">System Prompt</label>
                  <textarea 
                    value={formData.systemPrompt}
                    onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                    className="w-full h-32 bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                    placeholder="You are a helpful assistant..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-title-lg font-semibold">Knowledge & Context</h3>
              <p className="text-body-md text-on-surface-variant">Connect RAG sources so the agent has accurate information.</p>
              <div className="p-8 border-2 border-dashed border-outline-variant/50 rounded-2xl text-center">
                <Database className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                <p className="text-body-lg font-medium">No knowledge collections available</p>
                <p className="text-body-md text-on-surface-variant">Please create a knowledge collection in the platform settings.</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-title-lg font-semibold">Tools & Actions</h3>
              <p className="text-body-md text-on-surface-variant">Select the tools this agent is allowed to use.</p>
              <div className="grid grid-cols-2 gap-4">
                {['rag_search', 'send_email', 'update_crm', 'execute_workflow'].map(tool => (
                  <label key={tool} className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.tools.includes(tool)}
                      onChange={e => {
                        const newTools = e.target.checked 
                          ? [...formData.tools, tool]
                          : formData.tools.filter(t => t !== tool);
                        setFormData({ ...formData, tools: newTools });
                      }}
                      className="w-5 h-5 rounded text-primary focus:ring-primary bg-surface border-outline"
                    />
                    <span className="font-medium font-mono text-sm">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-title-lg font-semibold">Trust & Autonomy Level</h3>
              <p className="text-body-md text-on-surface-variant">Define how much independence this agent has.</p>
              
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(level => (
                  <label key={level} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.autonomyLevel === level 
                      ? 'border-primary bg-primary-container/10 shadow-sm' 
                      : 'border-outline-variant/30 hover:border-outline'
                  }`}>
                    <input 
                      type="radio" 
                      name="autonomy"
                      value={level}
                      checked={formData.autonomyLevel === level}
                      onChange={() => setFormData({ ...formData, autonomyLevel: level })}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-semibold text-title-md">Level {level}</div>
                      <div className="text-body-sm text-on-surface-variant mt-1">
                        {level === 1 && 'No autonomy. Drafts actions for human review.'}
                        {level === 2 && 'Read autonomy. Can execute safe read operations.'}
                        {level === 3 && 'Supervised Write. Requires Human Quorum for risky writes.'}
                        {level === 4 && 'High Autonomy. Executes writes, flagged anomalies only.'}
                        {level === 5 && 'Full Autonomy. Complete system access.'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-title-lg font-semibold">Review & Deploy</h3>
              <p className="text-body-md text-on-surface-variant">Confirm your agent's configuration.</p>
              
              <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant uppercase">Name</div>
                  <div className="font-medium">{formData.name || 'Untitled Agent'}</div>
                </div>
                <div>
                  <div className="text-label-sm text-on-surface-variant uppercase">Autonomy</div>
                  <div className="font-medium">Level {formData.autonomyLevel}</div>
                </div>
                <div>
                  <div className="text-label-sm text-on-surface-variant uppercase">Tools</div>
                  <div className="font-medium">{formData.tools.length > 0 ? formData.tools.join(', ') : 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-surface border-t border-outline-variant/30 p-6 flex items-center justify-between">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2.5 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Back
          </button>
          
          {currentStep < 5 ? (
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Deploy Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
