import React from 'react';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/get-user';
import { Factory, HeartPulse, Headphones, ShoppingBag, TrendingUp, Scale, GraduationCap, ArrowRight, ShieldCheck, LayoutGrid } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  GraduationCap,
  Factory,
  HeartPulse,
  Headphones,
  ShoppingBag,
  TrendingUp,
  Scale
};

export default function DashboardPage() {
  const user = requireUser();

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'viewer': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">Viewer</span>;
      case 'operator': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Operator</span>;
      case 'manager': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Manager</span>;
      case 'admin': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Admin</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-light text-white tracking-tight mb-3">
          Welcome back, <span className="font-medium text-amber-500">{user.fullName.split(' ')[0]}</span>
        </h1>
        <p className="text-lg text-neutral-400">
          Select a domain to access your workspace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {user.domains.map(domain => {
          const Icon = iconMap[domain.icon] || LayoutGrid;
          
          return (
            <Link 
              key={domain.slug}
              href={domain.route}
              className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-900/50"
            >
              {/* Dynamic left border accent */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: domain.color }}
              />
              
              <div className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800"
                    style={{ color: domain.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {getRoleBadge(domain.role)}
                </div>
                
                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-amber-500 transition-colors">
                  {domain.name}
                </h3>
                <p className="text-sm text-neutral-400 line-clamp-2 mb-6">
                  Access the {domain.name} intelligent operating system and manage operations.
                </p>
                
                <div className="flex items-center text-sm font-medium" style={{ color: domain.color }}>
                  Enter Domain
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}

        {user.domains.length === 0 && !user.isSuperAdmin && (
          <div className="col-span-full text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <p className="text-neutral-400">You do not have access to any domains yet.</p>
          </div>
        )}
      </div>

      {user.isSuperAdmin && (
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-8 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:text-left justify-between w-full">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <ShieldCheck className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-semibold text-white">Super Admin Access</h3>
                </div>
                <p className="text-neutral-400 text-sm max-w-sm">
                  Manage users, global roles, domains, and view security audit logs.
                </p>
              </div>
              <Link 
                href="/admin"
                className="mt-6 sm:mt-0 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                Open Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
