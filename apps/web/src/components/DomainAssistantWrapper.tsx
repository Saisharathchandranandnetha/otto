'use client';

import { usePathname } from 'next/navigation';
import { AIAssistant } from './AIAssistant';

const DOMAIN_COLORS: Record<string, string> = {
  education: '#3b82f6',
  manufacturing: '#f59e0b',
  healthcare: '#ef4444',
  support: '#a855f7',
  retail: '#ec4899',
  sales: '#10b981',
  legal: '#94a3b8',
  multilingual: '#ec4899',
  documents: '#14b8a6',
  developer: '#6366f1',
  'knowledge-base': '#a855f7',
};

export function DomainAssistantWrapper() {
  const pathname = usePathname();
  
  // Extract domain from pathname (e.g., /education -> education)
  const segments = pathname.split('/').filter(Boolean);
  const domain = segments[0] || 'default';
  
  const color = DOMAIN_COLORS[domain] || '#f59e0b';

  return <AIAssistant domain={domain} color={color} />;
}
