import React from 'react';
import { requireDomainAccess } from '@/lib/auth/get-user';
import { Scale, FileText, Search, Clock } from 'lucide-react';

export default async function LegalPage() {
  const user = requireDomainAccess('legal');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl">
              <Scale className="h-6 w-6 text-gray-400" />
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">Legal Command Center</h1>
          </div>
          <p className="text-neutral-400">Contract Drafting, Case Law Retrieval, and Intake AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[400px]">
            <h2 className="text-xl font-medium text-white mb-4">Deadline Tracker</h2>
            <div className="w-full h-full min-h-[300px] border border-neutral-800 border-dashed rounded-xl flex items-center justify-center bg-neutral-950/50">
              <p className="text-neutral-500 text-sm">Deadline Tracker Integration Pending</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-white">Active Contracts</h2>
            </div>
            <div className="text-3xl font-light text-white">124</div>
            <p className="text-xs text-emerald-500 mt-1">12 awaiting signature</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-white">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                <p className="text-sm font-medium text-gray-400">Smith vs. Acme Brief</p>
                <p className="text-xs text-red-500/70 mt-1">Due in 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
