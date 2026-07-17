'use client';

import React from 'react';

export function LiquidGlass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl ${className}`}>
      {children}
    </div>
  );
}
