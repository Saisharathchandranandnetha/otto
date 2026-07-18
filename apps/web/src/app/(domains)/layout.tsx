import React from 'react';
import { requireUser } from '@/lib/auth/get-user';
import { TopNavBar } from '@/components/nav/TopNavBar';

export default function DomainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireUser();

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <TopNavBar user={user} />
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
