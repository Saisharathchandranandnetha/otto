'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Building2, Code2, GraduationCap, BookOpen, ArrowRight, Sparkles, Shield, Zap, ChevronRight } from 'lucide-react';

/* ── Scramble text effect ── */
const CHARS = '!<>-_\\/[]{}—=+*^?#________';
function useScramble(target: string, speed = 35) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const total = target.length * 3 + 12;
    const tick = () => {
      frame++;
      const locked = Math.floor((frame / total) * target.length * 1.4);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        out += (i < locked || target[i] === ' ') ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(out);
      if (locked < target.length) raf = requestAnimationFrame(() => setTimeout(tick, speed / 3));
      else setDisplay(target);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return display;
}

/* ── Particle canvas ── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.5 + 0.1 });
    }
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,179,8,${p.o})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i]!.x - particles[j]!.x;
          const dy = particles[i]!.y - particles[j]!.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(234,179,8,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i]!.x, particles[i]!.y);
            ctx.lineTo(particles[j]!.x, particles[j]!.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ── Portal options ── */
const PORTALS = [
  {
    id: 'owner',
    label: 'Business Owner',
    sublabel: 'Run Your Operations',
    icon: Building2,
    color: '#f59e0b',
    bgGlow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.3)',
    description: 'Access your AI-powered business dashboard with inventory, ledger & automation.',
    redirect: '/dashboard',
  },
  {
    id: 'developer',
    label: 'Developer',
    sublabel: 'Build & Integrate',
    icon: Code2,
    color: '#6366f1',
    bgGlow: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
    description: 'Access the API, workflow studio, webhook builder, and SDK documentation.',
    redirect: '/dashboard',
  },
  {
    id: 'judge',
    label: 'Hackathon Judge',
    sublabel: 'Evaluate the Platform',
    icon: Shield,
    color: '#10b981',
    bgGlow: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.3)',
    description: 'View the full system: trust engine, state machine, domain playbooks & metrics.',
    redirect: '/dashboard',
  },
  {
    id: 'student',
    label: 'Student / Researcher',
    sublabel: 'Learn & Explore',
    icon: BookOpen,
    color: '#ec4899',
    bgGlow: 'rgba(236,72,153,0.15)',
    border: 'rgba(236,72,153,0.3)',
    description: 'Explore AI workflows, knowledge base, and autonomous agent architectures.',
    redirect: '/dashboard',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPortal = searchParams.get('portal') || '';

  const [step, setStep] = useState<'portal' | 'login'>(initialPortal ? 'login' : 'portal');
  const [selectedPortal, setSelectedPortal] = useState(initialPortal);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const heading = useScramble(step === 'portal' ? 'Select your portal' : 'Access the agent grid');
  const portal = PORTALS.find(p => p.id === selectedPortal);

  const handlePortalSelect = (id: string) => {
    setSelectedPortal(id);
    setTimeout(() => setStep('login'), 150);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const email = username.includes('@') ? username : `${username}@otto.ai`;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push(portal?.redirect || '/dashboard');
        return;
      }
      throw new Error('Invalid credentials');
    } catch {
      setLoading(false);
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      setTimeout(() => setError(false), 3500);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f14] overflow-hidden flex items-center justify-center px-4">
      {/* Particle background */}
      <ParticleCanvas />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/8 rounded-full blur-[120px]" />
        {portal && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] transition-all duration-700"
            style={{ background: portal.bgGlow }} />
        )}
      </div>

      {/* Logo top-left */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-black text-white tracking-tight text-lg font-mono">OTTO</span>
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest ml-1">v2</span>
      </div>

      {/* Status badge top-right */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Field Stable</span>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-500/70 mb-3">Otto / Gateway</p>
          <h1 className="text-2xl font-bold text-white font-mono min-h-[2rem]">{heading}</h1>
          {step === 'login' && portal && (
            <button onClick={() => setStep('portal')} className="mt-2 text-xs font-mono text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 mx-auto">
              <span>← change portal</span>
            </button>
          )}
        </div>

        {/* STEP 1: Portal selector */}
        {step === 'portal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PORTALS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePortalSelect(p.id)}
                  className="group relative text-left p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = p.border;
                    (e.currentTarget as HTMLElement).style.background = p.bgGlow;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-xl" style={{ background: p.bgGlow }}>
                      <Icon size={18} style={{ color: p.color }} />
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>
                  <p className="font-semibold text-white text-sm mb-0.5">{p.label}</p>
                  <p className="text-xs font-mono" style={{ color: p.color }}>{p.sublabel}</p>
                  <p className="text-xs text-white/35 mt-2 leading-relaxed">{p.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: Login form */}
        {step === 'login' && (
          <div
            className={`relative rounded-2xl border p-8 backdrop-blur-md transition-all duration-300 ${shaking ? 'animate-bounce' : ''}`}
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: portal ? portal.border : 'rgba(255,255,255,0.1)',
              boxShadow: portal ? `0 0 60px ${portal.bgGlow}` : 'none',
            }}
          >
            {/* Corner brackets */}
            <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-2xl border-l-2 border-t-2" style={{ borderColor: portal?.color || '#f59e0b' }} />
            <span className="absolute right-0 bottom-0 h-5 w-5 rounded-br-2xl border-r-2 border-b-2" style={{ borderColor: portal?.color || '#f59e0b' }} />

            {/* Portal badge */}
            {portal && (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                {(() => { const Icon = portal.icon; return <Icon size={16} style={{ color: portal.color }} />; })()}
                <span className="text-xs font-mono font-semibold" style={{ color: portal.color }}>{portal.label}</span>
                <span className="text-xs font-mono text-white/30 ml-auto">{portal.sublabel}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Username */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-white/50 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                />
                <p className="mt-1.5 font-mono text-xs text-white/25">Demo: <span className="text-amber-500/60 select-all">admin</span></p>
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                />
                <p className="mt-1.5 font-mono text-xs text-white/25">Demo: <span className="text-amber-500/60 select-all">otto2026</span></p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                  <p className="font-mono text-xs text-red-400">&gt; ACCESS_DENIED — try admin / otto2026</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-2xl active:scale-95 disabled:opacity-60"
                style={{ background: portal ? `linear-gradient(135deg, ${portal.color}, ${portal.color}cc)` : 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out hover:translate-x-full" />
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      Entering the grid…
                    </>
                  ) : (
                    <>Enter the grid <ArrowRight size={16} /></>
                  )}
                </span>
              </button>

              <div className="flex items-center gap-4 my-1">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs font-mono text-white/30 uppercase">or</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  setUsername('admin');
                  setPassword('otto2026');
                  setTimeout(() => {
                    handleLogin(e);
                  }, 100);
                }}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-center font-mono text-xs text-white/20 uppercase tracking-widest">
              Otto v2 · Earned-trust safety core
            </p>
          </div>
        )}

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/25">
            <Shield size={11} className="text-emerald-500/50" />
            Schema-locked
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/25">
            <Zap size={11} className="text-amber-500/50" />
            Idempotent
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/25">
            <GraduationCap size={11} className="text-blue-500/50" />
            Earned trust
          </div>
        </div>
      </div>
    </div>
  );
}
