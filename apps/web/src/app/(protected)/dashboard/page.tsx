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
  admin:    'bg-error-container text-on-error-container border-error/20',
  live:     'bg-primary-container text-on-primary-container border-primary/20',
  beta:     'bg-secondary-container text-on-secondary-container border-secondary/20',
  operator: 'bg-tertiary-container text-on-tertiary-container border-tertiary/20',
};

const CATEGORY_LABELS: Record<string, string> = {
  domain:   '🤖 AI Domain Agents',
  platform: '⚡ Intelligence Platform',
  ops:      '📊 Business Operations',
};

export default async function DashboardPage() {
  const user = await requireUser();

  const grouped = ['domain', 'platform', 'ops'].map(cat => ({
    cat,
    tiles: DOMAIN_TILES.filter(t => t.category === cat),
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-surface-container-lowest">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-display-sm font-semibold text-on-surface tracking-tight">
                Welcome back, <span className="text-primary">{(user.fullName || 'Admin').split(' ')[0]}</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">Select a domain or feature to access your workspace</p>
            </div>
          </div>
        </div>

        {/* Grouped tiles */}
        {grouped.map(({ cat, tiles }) => (
          <div key={cat} className="mb-10">
            <h2 className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4 font-medium">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {tiles.map(tile => {
                const Icon = tile.icon;
                return (
                  <Link
                    key={tile.slug}
                    href={tile.route}
                    className="group relative bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Color accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: tile.color }} />

                    <div className="p-5 pl-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/50" style={{ color: tile.color }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-label-sm px-2 py-0.5 rounded-full border ${BADGE_STYLES[tile.badge] || BADGE_STYLES.admin}`}>
                          {tile.badge}
                        </span>
                      </div>

                      <h3 className="text-title-md font-medium text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {tile.name}
                      </h3>

                      <div className="flex items-center text-label-md font-medium mt-3" style={{ color: tile.color }}>
                        <span>Enter workspace</span>
                        <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
            <div className="inline-flex items-center justify-center p-6 bg-surface-container border border-error/20 rounded-2xl w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 rounded-full blur-[100px]" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:text-left justify-between w-full gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1.5">
                    <ShieldCheck className="h-5 w-5 text-error" />
                    <h3 className="text-title-lg font-semibold text-on-surface">Super Admin Access</h3>
                  </div>
                  <p className="text-body-md text-on-surface-variant">Manage users, global roles, domains, and view security audit logs.</p>
                </div>
                <Link
                  href="/admin"
                  className="px-5 py-2.5 bg-error text-on-error hover:bg-error/90 font-medium rounded-xl transition-colors whitespace-nowrap text-label-lg"
                >
                  Open Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
