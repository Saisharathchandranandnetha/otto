import React from 'react';
import { requireDomainAccess } from '@/lib/auth/get-user';
import { HeartPulse, Activity, AlertCircle, Clock } from 'lucide-react';

export default async function HealthcarePage() {
  const user = requireDomainAccess('healthcare');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl">
              <HeartPulse className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">Healthcare Command Center</h1>
          </div>
          <p className="text-neutral-400">Clinical AI, Patient Triage, and Care Coordination</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[400px]">
            <h2 className="text-xl font-medium text-white mb-4">Patient Triage Live Feed</h2>
            <div className="w-full h-full min-h-[300px] border border-neutral-800 border-dashed rounded-xl flex items-center justify-center bg-neutral-950/50">
              <p className="text-neutral-500 text-sm">Live Feed Integration Pending</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-medium text-white">Avg. Wait Time</h2>
            </div>
            <div className="text-3xl font-light text-white">14 mins</div>
            <p className="text-xs text-emerald-500 mt-1">-2 mins vs average</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[190px]">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-medium text-white">Critical Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm font-medium text-red-400">Room 204: HR Spike</p>
                <p className="text-xs text-red-500/70 mt-1">Nurse dispatched</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
