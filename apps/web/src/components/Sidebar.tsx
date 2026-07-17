'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { title: 'Workspace', items: [
      { name: 'Overview', href: '/overview', icon: 'dashboard' },
      { name: 'Inbox', href: '/inbox', icon: 'inbox' },
    ]},
    { title: 'Platform', items: [
      { name: 'Agents', href: '/platform/agents', icon: 'robot_2' },
      { name: 'Workflows', href: '/platform/workflows', icon: 'account_tree' },
      { name: 'Integrations', href: '/platform/integrations', icon: 'extension' },
    ]}
  ];

  return (
    <aside className="w-64 bg-surface border-r border-surface-container-highest hidden md:flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-4 border-b border-surface-container-highest flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">O</div>
        <h2 className="text-title-lg font-bold text-on-surface">Otto</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {navItems.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-label-sm font-semibold text-on-surface-variant mb-2 px-3 uppercase tracking-wider">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-body-md transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-surface-container-highest">
        <div className="flex items-center gap-3 px-3 py-2 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">keyboard</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-surface-container rounded font-mono text-[10px]">⌘K</kbd> to search</span>
        </div>
      </div>
    </aside>
  );
}
