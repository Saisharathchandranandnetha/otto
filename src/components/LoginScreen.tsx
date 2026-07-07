'use client';

import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setAuthenticating(true);

    // Brief delay so the "authenticating" state is visible
    setTimeout(() => {
      const ok = onLogin(username, password);
      setAuthenticating(false);
      if (!ok) {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 450);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface flex items-center justify-center px-4 py-12">
      {/* ── Animated grid backdrop ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-grid-drift opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(54,102,103,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(54,102,103,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Floating glow orbs ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-orb-float"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-3xl animate-orb-float-alt"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-tertiary/10 blur-2xl animate-orb-float"
        style={{ animationDelay: '-6s' }}
      />

      {/* ── Horizontal scanning beam ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 h-px animate-scan-beam bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
      />

      {/* ── Rotating orbital glyph behind card ─────────────────── */}
      <div
        aria-hidden="true"
        className="absolute h-[34rem] w-[34rem] animate-glyph-spin rounded-full border border-dashed border-secondary/15"
      />
      <div
        aria-hidden="true"
        className="absolute h-[26rem] w-[26rem] animate-glyph-spin rounded-full border border-secondary/10"
        style={{ animationDirection: 'reverse', animationDuration: '20s' }}
      />

      {/* ── Login card ─────────────────────────────────────────── */}
      <div className="relative w-full max-w-md">
        {/* Animated gradient border frame */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-3xl animate-border-flow"
          style={{
            background:
              'linear-gradient(90deg, rgba(156,62,38,0.35), rgba(54,102,103,0.45), rgba(156,62,38,0.35), rgba(54,102,103,0.45))',
            backgroundSize: '200% 100%',
          }}
        />

        <div
          className={`relative rounded-3xl bg-surface-container-lowest/90 backdrop-blur-xl px-8 py-10 shadow-[0_20px_60px_rgba(54,102,103,0.12)] ${
            shaking ? 'animate-shake' : ''
          }`}
        >
          {/* Logo mark with pulsing rings */}
          <div className="fade-in-up flex justify-center" style={{ animationDelay: '80ms' }}>
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border-2 border-primary/40 animate-ring-pulse"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-secondary/40 animate-ring-pulse"
                style={{ animationDelay: '1.3s' }}
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/25">
                <span className="material-symbols-outlined text-[32px]">smart_toy</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="fade-in-up mt-6 text-center" style={{ animationDelay: '180ms' }}>
            <h1 className="text-headline-lg font-bold text-on-surface text-balance">
              Sign in to Otto
            </h1>
            <p className="mt-2 text-body-md text-on-surface-variant text-pretty">
              Autonomous Workflow Agents Platform
            </p>
          </div>

          {/* Status line */}
          <div
            className="fade-in-up mt-5 flex items-center justify-center gap-2"
            style={{ animationDelay: '260ms' }}
          >
            <span className={authenticating ? 'live-dot bg-warm animate-pulse-dot' : 'live-dot--on animate-pulse-dot'} />
            <span className="font-mono text-label-sm tracking-widest text-on-surface-variant uppercase">
              {authenticating ? 'Verifying credentials…' : 'Agent gateway online'}
            </span>
          </div>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="fade-in-up" style={{ animationDelay: '340ms' }}>
              <label htmlFor="login-username" className="block text-label-lg text-on-surface mb-1.5">
                Username
              </label>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/60 transition-colors duration-200 group-focus-within:text-secondary"
                >
                  person
                </span>
                <input
                  id="login-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input w-full pl-10 py-2.5 transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(54,102,103,0.12),0_0_20px_rgba(54,102,103,0.15)]"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password */}
            <div className="fade-in-up" style={{ animationDelay: '420ms' }}>
              <label htmlFor="login-password" className="block text-label-lg text-on-surface mb-1.5">
                Password
              </label>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/60 transition-colors duration-200 group-focus-within:text-secondary"
                >
                  lock
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-10 py-2.5 transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(54,102,103,0.12),0_0_20px_rgba(54,102,103,0.15)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="animate-fade-in flex items-center justify-center gap-2 rounded-lg border border-error/30 bg-error/5 px-3 py-2"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-error">
                  warning
                </span>
                <p className="text-label-sm text-error">
                  Access denied. Try admin / otto2026
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="fade-in-up" style={{ animationDelay: '500ms' }}>
              <button
                type="submit"
                disabled={authenticating}
                className="btn-primary group relative w-full overflow-hidden"
              >
                {/* Shimmer sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                {authenticating ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin"
                    />
                    Authenticating
                  </>
                ) : (
                  <>
                    Initialize Session
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p
            className="fade-in-up mt-8 text-center font-mono text-label-sm tracking-widest text-on-surface-variant/50 uppercase"
            style={{ animationDelay: '580ms' }}
          >
            Otto v2 · Earned-trust safety core
          </p>
        </div>
      </div>
    </div>
  );
}
