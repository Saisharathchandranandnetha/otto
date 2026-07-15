'use client';
// App shell — wraps TopAppBar + page content + BottomNav.
// Handles body padding so content doesn't hide behind fixed bars.
// AmbientParticles adds a subtle floating particle canvas behind everything.
import { TopAppBar } from './TopAppBar';
import { BottomNav } from './BottomNav';
import { AmbientParticles } from './AmbientParticles';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Ambient floating particles — fixed behind all content */}
      <AmbientParticles />

      <TopAppBar />
      <div className="relative z-10 pt-[48px] pb-[100px] md:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
