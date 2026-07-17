import React from 'react';
import { requireDomainAccess } from '@/lib/auth/get-user';
import { TrendingUp, Target, Users, DollarSign } from 'lucide-react';

export default async function SalesPage() {
  const user = requireDomainAccess('sales');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">Sales Command Center</h1>
          </div>
          <p className="text-neutral-400">Lead Qualification, CPQ, and Deal Pipeline AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[400px]">
            <h2 className="text-xl font-medium text-white mb-4">Deal Pipeline Tracker</h2>
            <div className="w-full h-full min-h-[300px] border border-neutral-800 border-dashed rounded-xl flex items-center justify-center bg-neutral-950/50">
              <p className="text-neutral-500 text-sm">Pipeline Integration Pending</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-white">Win Rate</h2>
            </div>
            <div className="text-3xl font-light text-white">42.8%</div>
            <p className="text-xs text-emerald-500 mt-1">+2.4% vs last quarter</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-white">Key Opportunities</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm font-medium text-emerald-400">Acme Corp Enterprise</p>
                <p className="text-xs text-emerald-500/70 mt-1">AI predicts 85% close prob.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
