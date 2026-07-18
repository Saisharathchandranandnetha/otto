import React from 'react';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/get-user';
import {
  Factory, HeartPulse, Headphones, ShoppingBag, TrendingUp, Scale,
  GraduationCap, ArrowRight, ShieldCheck, LayoutGrid, Languages,
  Database, FileText, Code2, Users, Globe, Lock, Cpu, Workflow,
  BookOpen, BarChart3, Sparkles
} from 'lucide-react';

// ── All platform tiles ──────────────────────────────────────────────────────
const DOMAIN_TILES = [
  // Core AI domains (from JWT)
  { slug: 'education',     name: 'Education',         icon: GraduationCap, route: '/education',      color: '#3b82f6', badge: 'admin',  category: 'domain' },
  { slug: 'manufacturing', name: 'Manufacturing',      icon: Factory,       route: '/manufacturing',  color: '#f59e0b', badge: 'admin',  category: 'domain' },
  { slug: 'healthcare',    name: 'Healthcare',         icon: HeartPulse,    route: '/healthcare',     color: '#ef4444', badge: 'admin',  category: 'domain' },
  { slug: 'support',       name: 'Customer Support',   icon: Headphones,    route: '/support',        color: '#a855f7', badge: 'admin',  category: 'domain' },
  { slug: 'retail',        name: 'Retail',             icon: ShoppingBag,   route: '/retail',         color: '#ec4899', badge: 'admin',  category: 'domain' },
  { slug: 'sales',         name: 'Sales',              icon: TrendingUp,    route: '/sales',          color: '#10b981', badge: 'admin',  category: 'domain' },
  { slug: 'legal',         name: 'Legal',              icon: Scale,         route: '/legal',          color: '#94a3b8', badge: 'admin',  category: 'domain' },
  // Intelligence & Platform
  { slug: 'multilingual',  name: 'Multilingual',       icon: Languages,     route: '/multilingual',   color: '#ec4899', badge: 'live',   category: 'platform' },
  { slug: 'knowledge',     name: 'Knowledge Base',     icon: Database,      route: '/knowledge-base', color: '#a855f7', badge: 'live',   category: 'platform' },
  { slug: 'documents',     name: 'AI Documents',       icon: FileText,      route: '/documents',      color: '#14b8a6', badge: 'live',   category: 'platform' },
  { slug: 'developer',     name: 'Developer SDK',      icon: Code2,         route: '/developer',      color: '#6366f1', badge: 'live',   category: 'platform' },
  { slug: 'vas',           name: 'Workflow Studio',    icon: Workflow,      route: '/vas',            color: '#6366f1', badge: 'live',   category: 'platform' },
  // Operations
  { slug: 'inventory',     name: 'Inventory',          icon: LayoutGrid,    route: '/inventory',      color: '#f97316', badge: 'admin',  category: 'ops' },
  { slug: 'ledger',        name: 'Ledger',             icon: BarChart3,     route: '/ledger',         color: '#14b8a6', badge: 'admin',  category: 'ops' },
];

const BADGE_STYLES: Record<string, string> = {
  admin:    'bg-red-500/10 text-red-400 border-red-500/20',
  live:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  beta:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
  operator: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const CATEGORY_LABELS: Record<string, string> = {
  domain:   '🤖 AI Domain Agents',
  platform: '⚡ Intelligence Platform',
  ops:      '📊 Business Operations',
};

export default function DashboardPage() {
  const user = requireUser();

  const grouped = ['domain', 'platform', 'ops'].map(cat => ({
    cat,
    tiles: DOMAIN_TILES.filter(t => t.category === cat),
  }));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight">
              Welcome back, <span className="font-semibold text-amber-400">{user.fullName.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-neutral-400">Select a domain or feature to access your workspace</p>
          </div>
        </div>
      </div>

      {/* Grouped tiles */}
      {grouped.map(({ cat, tiles }) => (
        <div key={cat} className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
            {CATEGORY_LABELS[cat]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {tiles.map(tile => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.slug}
                  href={tile.route}
                  className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-neutral-900/50"
                >
                  {/* Color accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: tile.color }} />

                  <div className="p-5 pl-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-neutral-950/50 border border-neutral-800" style={{ color: tile.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${BADGE_STYLES[tile.badge] || BADGE_STYLES.admin}`}>
                        {tile.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {tile.name}
                    </h3>

                    <div className="flex items-center text-sm font-medium mt-3" style={{ color: tile.color }}>
                      <span className="text-xs">Enter</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Super admin panel */}
      {user.isSuperAdmin && (
        <div className="mt-4">
          <div className="inline-flex items-center justify-center p-6 bg-neutral-900 border border-neutral-800 rounded-2xl w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/8 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:text-left justify-between w-full gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-1.5">
                  <ShieldCheck className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-white">Super Admin Access</h3>
                </div>
                <p className="text-neutral-400 text-sm">Manage users, global roles, domains, and view security audit logs.</p>
              </div>
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-xl transition-colors whitespace-nowrap text-sm"
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
