'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Zap, Shield, Brain, Workflow, MessageSquare, BarChart3,
  ArrowRight, Sparkles, Factory, HeartPulse, Headphones, 
  ShoppingBag, TrendingUp, Scale, Star, Code, ArrowUpRight,
  GraduationCap, Check
} from 'lucide-react';

// Dynamic imports for D3 components (client-only)
const D3ParticleNetwork = dynamic(
  () => import('@/components/landing/D3ParticleNetwork').then(m => ({ default: m.D3ParticleNetwork })),
  { ssr: false }
);
const D3OrbitalRing = dynamic(
  () => import('@/components/landing/D3OrbitalRing').then(m => ({ default: m.D3OrbitalRing })),
  { ssr: false }
);

/* ── Scroll Reveal ────────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Feature Card ─────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, color, delay }: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string; description: string; color: string; delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
        <div className={`inline-flex p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
        
        {/* Subtle glass reflection */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl pointer-events-none group-hover:bg-white/60 transition-colors duration-500" />
      </div>
    </Reveal>
  );
}

/* ── Landing Page (White / Professional / Futuristic) ───────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Otto<span className="text-slate-400 font-medium">.ai</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#platform" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#developers" className="hover:text-slate-900 transition-colors">Developers</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95">
              Start Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* D3 Particle Network Background */}
        <div className="absolute inset-0 z-0">
          <D3ParticleNetwork color="#CBD5E1" particleCount={60} />
        </div>
        
        {/* White fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/50 border border-amber-200 text-amber-700 mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase">Introducing Otto V2</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900 mb-8">
                Autonomous AI <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  you can trust.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The enterprise-grade operating system for multi-domain AI agents. 
                Otto learns your workflows, earns your trust, and automates your business.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login?portal=owner"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all active:scale-95">
                  Run Your Business
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login?portal=developer"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all hover:shadow-sm active:scale-95">
                  <Code size={20} className="text-slate-400" />
                  Developer Portal
                </Link>
              </div>
            </Reveal>
            
            <Reveal delay={400}>
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> SOC2 Compliant</div>
                <div className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> 99.99% Uptime</div>
              </div>
            </Reveal>
          </div>
          
          <div className="hidden lg:block">
            <Reveal delay={300}>
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/40 to-blue-50/40 rounded-full blur-3xl opacity-50" />
                <D3OrbitalRing />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY TICKER ────────────────────────────────────────── */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Specialized Intelligence For</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {[
              { icon: GraduationCap, label: 'Education' },
              { icon: Factory, label: 'Manufacturing' },
              { icon: HeartPulse, label: 'Healthcare' },
              { icon: Headphones, label: 'Support' },
              { icon: ShoppingBag, label: 'Retail' },
              { icon: TrendingUp, label: 'Sales' },
              { icon: Scale, label: 'Legal' },
            ].map((d, i) => (
              <Reveal key={d.label} delay={i * 50}>
                <div className="flex items-center gap-3 text-slate-400 hover:text-slate-800 transition-colors duration-300 grayscale hover:grayscale-0 cursor-default">
                  <d.icon size={24} />
                  <span className="text-lg font-bold tracking-tight">{d.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM FEATURES ───────────────────────────────────────── */}
      <section id="platform" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-amber-500 font-bold tracking-wide uppercase text-sm mb-4">The Operating System for AI</h2>
              <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything you need to ship autonomous agents.</h3>
              <p className="text-xl text-slate-600">Stop gluing together disparate APIs. Otto provides the complete infrastructure to build, deploy, and govern AI workers.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard delay={0} icon={Shield} title="Trust Engine V2" description="Agents start in Observe mode (L0) and earn autonomy up to Certified (L4) through proven decisions and quorum approvals." color="text-emerald-500 bg-emerald-500" />
            <FeatureCard delay={100} icon={Brain} title="Agent Runtime" description="Stateful execution loop with SSE streaming, tool-calling, multi-agent coordination, and persistent episodic memory." color="text-blue-500 bg-blue-500" />
            <FeatureCard delay={200} icon={BarChart3} title="Knowledge Platform" description="Enterprise RAG with pgvector. Semantic chunking, reciprocal rank fusion, and automated evaluation harnesses built-in." color="text-purple-500 bg-purple-500" />
            <FeatureCard delay={0} icon={Workflow} title="Workflow Studio" description="Visual React Flow builder coupled with a high-performance orchestration engine. Custom nodes for complex logic and API integrations." color="text-amber-500 bg-amber-500" />
            <FeatureCard delay={100} icon={MessageSquare} title="Omnichannel" description="Deploy agents seamlessly to WhatsApp, Telegram, Slack, Web widgets, and API. Unified threading regardless of source." color="text-pink-500 bg-pink-500" />
            <FeatureCard delay={200} icon={Star} title="Analytics & Billing" description="Real-time token metering, cost attribution by organization, and built-in Stripe billing. Actionable insights on agent performance." color="text-cyan-500 bg-cyan-500" />
          </div>
        </div>
      </section>

      {/* ── CTA / DUAL PORTAL ───────────────────────────────────────── */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">Ready to scale with AI?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join the forward-thinking teams using Otto to automate complex workflows and build trust-first AI agents.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Reveal delay={100}>
              <Link href="/login?portal=owner" className="block group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Factory size={120} />
                </div>
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 mb-6">
                  <BriefcaseIcon />
                </div>
                <h3 className="text-2xl font-bold mb-3">Business Owner</h3>
                <p className="text-slate-400 mb-8 max-w-[250px]">Deploy pre-trained industry agents to automate your operations instantly.</p>
                <span className="inline-flex items-center gap-2 font-bold text-amber-400 group-hover:gap-3 transition-all">
                  Run Your Business <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>

            <Reveal delay={200}>
              <Link href="/login?portal=developer" className="block group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code size={120} />
                </div>
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/20 text-blue-400 mb-6">
                  <TerminalIcon />
                </div>
                <h3 className="text-2xl font-bold mb-3">Developer</h3>
                <p className="text-slate-400 mb-8 max-w-[250px]">Access the API, build custom tools, and orchestrate complex agent workflows.</p>
                <span className="inline-flex items-center gap-2 font-bold text-blue-400 group-hover:gap-3 transition-all">
                  Start Building <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">Otto.ai</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          <p className="text-sm text-slate-400 font-medium">&copy; 2026 Otto AI, Inc.</p>
        </div>
      </footer>
    </div>
  );
}

// Helpers
function BriefcaseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function TerminalIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>;
}
