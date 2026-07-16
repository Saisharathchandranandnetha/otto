'use client';
// Top app bar — the persistent header from Stitch design.
// Left: globe icon (language switcher). Center-left: "Otto" brand.
// Right: compact trust badge + verified_user icon + logout button.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/lib/auth';

type Tab = { href: string; label: string; external?: boolean };

const DESKTOP_TABS: Tab[] = [
  { href: '/', label: 'Engine' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/ledger', label: 'Ledger' },
  { href: '/settings', label: 'Settings' },
  { href: '/vas', label: 'Automation Studio' },
];

export function TopAppBar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 z-40 flex w-full items-center justify-between
                 px-container-padding h-touch-target-min
                 bg-background transition-all duration-300"
    >
      {/* Left: language + brand */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link href="/" className="text-headline-md font-bold text-primary flex items-center gap-1.5">
          Otto
          <span
            className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded-full leading-none"
            style={{
              animation: 'betaGlow 2s ease-in-out infinite',
            }}
          >
            Beta
          </span>
          <style jsx>{`
            @keyframes betaGlow {
              0%, 100% { box-shadow: 0 0 4px rgba(156, 62, 38, 0.2); opacity: 0.85; }
              50% { box-shadow: 0 0 12px rgba(156, 62, 38, 0.5), 0 0 24px rgba(156, 62, 38, 0.15); opacity: 1; }
            }
          `}</style>
        </Link>
      </div>

      {/* Center: desktop nav links (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-6" aria-label="Desktop navigation">
        {DESKTOP_TABS.map((tab) => {
          if (tab.external) {
            return (
              <a
                key={tab.href}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-lg transition-colors text-on-surface-variant hover:text-primary flex items-center gap-1"
              >
                {tab.label}
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            );
          }
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-label-lg transition-colors ${
                active
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: trust badge + shield + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-dim">
          <span
            className="material-symbols-outlined text-secondary text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield
          </span>
          <span className="text-label-sm text-on-surface-variant">98%</span>
        </div>
        <span
          className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity cursor-pointer"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified_user
        </span>
        <button
          onClick={logout}
          title="Sign out"
          className="flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1.5 text-label-sm font-medium text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/40 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

