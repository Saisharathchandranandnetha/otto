import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto text-center px-4">
        <div className="inline-flex items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-full mb-6 shadow-2xl">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">
          Access Denied
        </h1>
        
        <p className="text-neutral-400 mb-8 leading-relaxed">
          You don't have permission to access this domain. If you believe this is an error, please contact your Otto system administrator.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-medium text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
