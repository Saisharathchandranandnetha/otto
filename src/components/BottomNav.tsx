'use client';
// Mobile bottom navigation — the persistent 4-tab bar from the Stitch design.
// Active tab gets a terracotta primary-container pill; inactive tabs are muted.
// Hidden on md+ breakpoints where we show a top nav instead.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Feed', icon: 'home_app_logo' },
  { href: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { href: '/ledger', label: 'Ledger', icon: 'menu_book' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around
                 h-[72px] px-base pb-safe
                 bg-surface shadow-[0_-4px_16px_rgba(54,102,103,0.08)] rounded-t-xl
                 md:hidden"
      aria-label="Main navigation"
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center px-4 py-1 h-touch-target-min
                       transition-all duration-200 rounded-full
                       ${active
                         ? 'bg-primary-container text-on-primary-container scale-90'
                         : 'text-on-surface-variant hover:bg-surface-container-high'
                       }`}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-label-sm mt-1">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
