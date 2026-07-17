import React from 'react';
import { requireUser } from '@/lib/auth/get-user';
import { TopNavBar } from '@/components/nav/TopNavBar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireUser();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <TopNavBar user={user} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
