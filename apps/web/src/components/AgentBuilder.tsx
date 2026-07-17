'use client';

import { useState } from 'react';

export function AgentBuilder() {
  const [activeTab, setActiveTab] = useState<'configuration' | 'knowledge' | 'tools'>('configuration');
  
  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col min-h-0 bg-surface rounded-xl border border-surface-container-highest overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-surface-container-highest px-4 bg-surface-container-lowest">
          <button 
            className={`px-4 py-4 text-label-md font-medium border-b-2 transition-colors ${activeTab === 'configuration' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('configuration')}
          >
            Configuration
          </button>
          <button 
            className={`px-4 py-4 text-label-md font-medium border-b-2 transition-colors ${activeTab === 'knowledge' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('knowledge')}
          >
            Knowledge Base
          </button>
          <button 
            className={`px-4 py-4 text-label-md font-medium border-b-2 transition-colors ${activeTab === 'tools' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools & Actions
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'configuration' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">Agent Name</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Invoice Processor"
                  defaultValue="Accounts Payable Agent"
                />
              </div>
              
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">System Prompt</label>
                <textarea 
                  className="w-full h-32 bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="You are an expert at processing invoices..."
                  defaultValue="You are an autonomous agent responsible for extracting data from supplier invoices, matching them against open Purchase Orders, and submitting them to the approval queue."
                />
                <p className="mt-2 text-body-sm text-on-surface-variant">The core instructions that define the agent's behavior and constraints.</p>
              </div>

              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">Model Selection</label>
                <select className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option>Otto Balanced (Gemini 1.5 Flash)</option>
                  <option>Otto Complex (Gemini 1.5 Pro)</option>
                  <option>Llama 3 70B (Groq)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="border border-dashed border-surface-container-highest rounded-xl p-8 text-center bg-surface-container-lowest flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-primary mb-3">upload_file</span>
                <h4 className="text-title-sm font-semibold text-on-surface">Upload Documents</h4>
                <p className="text-body-sm text-on-surface-variant mt-1 mb-4">PDF, CSV, or Text files up to 50MB</p>
                <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg text-label-md font-medium hover:bg-surface-container-highest transition-colors">
                  Select Files
                </button>
              </div>
              
              <h4 className="text-title-sm font-semibold text-on-surface mt-6 mb-2">Attached Knowledge</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-surface-container-highest rounded-lg bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                    <span className="text-body-sm font-medium">vendor_policies_2026.pdf</span>
                  </div>
                  <button className="text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Database Query', desc: 'Read/write access to Otto PostgreSQL', active: true, icon: 'database' },
                  { name: 'Email Sender', desc: 'Send emails via Resend', active: true, icon: 'mail' },
                  { name: 'Web Scraper', desc: 'Extract data from URLs', active: false, icon: 'language' },
                  { name: 'Slack Notify', desc: 'Send messages to Slack channels', active: false, icon: 'tag' },
                ].map(tool => (
                  <div key={tool.name} className={`p-4 border rounded-xl flex items-start gap-4 transition-colors ${tool.active ? 'border-primary bg-primary/5' : 'border-surface-container-highest bg-surface-container-lowest'}`}>
                    <div className="mt-1">
                      <span className={`material-symbols-outlined ${tool.active ? 'text-primary' : 'text-on-surface-variant'}`}>{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-label-lg font-medium text-on-surface">{tool.name}</h4>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">{tool.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" className="sr-only peer" defaultChecked={tool.active} />
                      <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Live Preview / Playground */}
      <div className="w-full lg:w-96 flex flex-col bg-surface rounded-xl border border-surface-container-highest overflow-hidden">
        <div className="p-4 border-b border-surface-container-highest bg-surface-container-lowest flex items-center justify-between">
          <h3 className="text-title-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">play_circle</span>
            Live Preview
          </h3>
          <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">Otto Balanced</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-surface-container-lowest/50 flex flex-col gap-4">
          {/* Chat bubbles */}
          <div className="self-end max-w-[85%] bg-primary text-on-primary rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm text-body-sm">
            Can you process this new invoice from ACME Corp?
          </div>
          
          <div className="self-start max-w-[85%] bg-surface border border-surface-container-highest rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <p className="text-body-sm text-on-surface mb-2">
              I've processed the invoice from ACME Corp.
            </p>
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-2 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                <span>ACTION: DATABASE_QUERY</span>
                <span>0.4s</span>
              </div>
              <code className="text-[10px] text-on-surface bg-surface-container rounded px-1 py-0.5 overflow-x-auto">
                SELECT * FROM purchase_orders WHERE vendor = 'ACME Corp'
              </code>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-surface-container-highest bg-surface">
          <div className="relative">
            <input 
              type="text" 
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-full pl-4 pr-10 py-2 text-body-sm focus:outline-none focus:border-primary"
              placeholder="Test your agent..."
            />
            <button className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
