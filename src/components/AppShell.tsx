'use client';
// App shell — wraps TopAppBar + page content + BottomNav.
// Handles body padding so content doesn't hide behind fixed bars.
import { TopAppBar } from './TopAppBar';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopAppBar />
      <div className="pt-[48px] pb-[100px] md:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
