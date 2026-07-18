'use client';

import { useEffect, useState } from 'react';
import { ParticleField, type ParticleMode } from './ParticleField';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean | Promise<boolean>;
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

/** Decryption-style text reveal: characters scramble then lock in one by one */
function useScrambleText(target: string, speed = 35) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    let raf = 0;
    const totalFrames = target.length * 3 + 12;

    const tick = () => {
      frame++;
      const lockedCount = Math.floor((frame / totalFrames) * target.length * 1.4);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < lockedCount || target[i] === ' ') {
          out += target[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplay(out);
      if (lockedCount < target.length) {
        raf = requestAnimationFrame(() => setTimeout(tick, speed / 3));
      } else {
        setDisplay(target);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);

  return display;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const heading = useScrambleText('Access the agent grid');

  const particleMode: ParticleMode = authenticating ? 'vortex' : error ? 'error' : 'idle';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setAuthenticating(true);

    // Let the vortex play before resolving
    setTimeout(async () => {
      const ok = await onLogin(username, password);
      setAuthenticating(false);
      if (!ok) {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 450);
        setTimeout(() => setError(false), 3500);
      }
    }, 1100);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      {/* Interactive particle constellation — forms the OTTO wordmark */}
      <ParticleField mode={particleMode} text="OTTO" />

      {/* Soft vignette so the form area stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 75% 50%, rgba(54,102,103,0.05), transparent 70%)',
        }}
      />

      <div className="relative flex min-h-screen flex-col items-center justify-end px-4 pb-10 pt-56 sm:flex-row sm:justify-end sm:pb-0 sm:pt-0 lg:pr-[12vw]">
        {/* Tagline anchored to the wordmark on desktop */}
        <div className="pointer-events-none absolute left-[8%] top-[68%] hidden max-w-xs sm:block">
          <p className="fade-in-up font-mono text-label-sm uppercase tracking-[0.3em] text-on-surface-variant/70" style={{ animationDelay: '900ms' }}>
            Autonomous workflow agents
          </p>
          <p className="fade-in-up mt-2 font-mono text-label-sm tracking-widest text-secondary/60" style={{ animationDelay: '1100ms' }}>
            {'// move your cursor through the field'}
          </p>
        </div>

        {/* ── Login card ─────────────────────────────────────────── */}
        <div className="relative w-full max-w-sm sm:my-12">
          <div
            className={`relative rounded-3xl border border-outline-variant/40 bg-surface-container-lowest/80 px-8 py-10 backdrop-blur-md shadow-[0_20px_60px_rgba(54,102,103,0.12)] ${
              shaking ? 'animate-shake' : ''
            }`}
          >
            {/* Corner brackets — HUD frame accents */}
            <span aria-hidden="true" className="absolute left-0 top-0 h-5 w-5 rounded-tl-3xl border-l-2 border-t-2 border-primary/60" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 h-5 w-5 rounded-br-3xl border-b-2 border-r-2 border-secondary/60" />

            {/* Heading with decryption effect */}
            <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="font-mono text-label-sm uppercase tracking-[0.35em] text-primary">
                Otto / Gateway
              </p>
              <h1 className="mt-3 min-h-[2.25rem] text-headline-md font-bold text-on-surface">
                {heading}
              </h1>
            </div>

            {/* Status line */}
            <div className="fade-in-up mt-4 flex items-center gap-2" style={{ animationDelay: '220ms' }}>
              <span className={authenticating ? 'live-dot bg-warm animate-pulse-dot' : error ? 'live-dot--off animate-pulse-dot' : 'live-dot--on animate-pulse-dot'} />
              <span className="font-mono text-label-sm tracking-widest text-on-surface-variant uppercase">
                {authenticating ? 'Collapsing field…' : error ? 'Signal rejected' : 'Field stable'}
              </span>
            </div>

            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="fade-in-up" style={{ animationDelay: '320ms' }}>
                <label htmlFor="login-username" className="block font-mono text-label-sm uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input w-full py-2.5 font-mono transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(54,102,103,0.12),0_0_24px_rgba(54,102,103,0.18)]"
                  placeholder="admin"
                />
                <p className="mt-1.5 font-mono text-label-sm text-on-surface-variant/50">Username: <span className="text-primary/70 select-all">admin</span></p>
              </div>

              {/* Password */}
              <div className="fade-in-up" style={{ animationDelay: '420ms' }}>
                <label htmlFor="login-password" className="block font-mono text-label-sm uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full py-2.5 font-mono transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(54,102,103,0.12),0_0_24px_rgba(54,102,103,0.18)]"
                  placeholder="••••••••"
                />
                <p className="mt-1.5 font-mono text-label-sm text-on-surface-variant/50">Password: <span className="text-primary/70 select-all">otto2026</span></p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="animate-fade-in rounded-lg border border-error/30 bg-error/5 px-3 py-2"
                >
                  <p className="font-mono text-label-sm text-error">
                    {'> ACCESS_DENIED — try admin / otto2026'}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="fade-in-up" style={{ animationDelay: '520ms' }}>
                <button
                  type="submit"
                  disabled={authenticating}
                  className="btn-primary group relative w-full overflow-hidden"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  {authenticating ? 'Entering the grid…' : 'Enter the grid'}
                </button>
              </div>
            </form>

            <p
              className="fade-in-up mt-8 text-center font-mono text-label-sm tracking-widest text-on-surface-variant/50 uppercase"
              style={{ animationDelay: '640ms' }}
            >
              Otto v2 · Earned-trust safety core
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
