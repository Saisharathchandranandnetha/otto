import React from 'react';
import Link from 'next/link';
import { ParticleField } from '@/components/ParticleField';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <ParticleField mode="idle" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          The Definitive <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Antigravity Build
          </span>
        </h1>
        
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Production-grade SaaS platform for building, deploying, and operating autonomous AI agents that earn trust through demonstrated reliability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Start Building
          </Link>
          <Link 
            href="/overview" 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors border border-slate-700"
          >
            Enter Workspace
          </Link>
        </div>
      </div>
      
      {/* Domain Showcase Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {['Education', 'Healthcare', 'Manufacturing'].map((domain) => (
          <div key={domain} className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-2">{domain} Playbook</h3>
            <p className="text-slate-400 text-sm">Pre-configured workflows and specialized capabilities for {domain.toLowerCase()} use cases.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
