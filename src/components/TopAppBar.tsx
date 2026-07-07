'use client';
// Top app bar — the persistent header from Stitch design.
// Left: globe icon (language switcher). Center-left: "Otto" brand.
// Right: compact trust badge + verified_user icon.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';

const DESKTOP_TABS = [
  { href: '/', label: 'Engine' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/ledger', label: 'Ledger' },
  { href: '/settings', label: 'Settings' },
] as const;

export function TopAppBar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 z-40 flex w-full items-center justify-between
                 px-container-padding h-touch-target-min
                 bg-background transition-all duration-300"
    >
      {/* Left: language + brand */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link href="/" className="text-headline-md font-bold text-primary">
          Otto
        </Link>
      </div>

      {/* Center: desktop nav links (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-6" aria-label="Desktop navigation">
        {DESKTOP_TABS.map((tab) => {
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

      {/* Right: trust badge + shield */}
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
      </div>
    </header>
  );
}
