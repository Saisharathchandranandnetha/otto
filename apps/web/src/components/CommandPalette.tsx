'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Action = {
  id: string;
  title: string;
  icon: string;
  onSelect: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Toggle on Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions: Action[] = [
    { id: 'go-overview', title: 'Go to Overview', icon: 'dashboard', onSelect: () => router.push('/overview') },
    { id: 'go-agents', title: 'Manage Agents', icon: 'robot_2', onSelect: () => router.push('/platform/agents') },
    { id: 'go-workflows', title: 'Manage Workflows', icon: 'account_tree', onSelect: () => router.push('/platform/workflows') },
    { id: 'create-agent', title: 'Create new Agent', icon: 'add', onSelect: () => router.push('/platform/agents/new') },
    { id: 'create-workflow', title: 'Create new Workflow', icon: 'add', onSelect: () => router.push('/platform/workflows/new') },
    { id: 'theme-light', title: 'Switch to Light Theme', icon: 'light_mode', onSelect: () => document.documentElement.classList.replace('dark', 'light') },
    { id: 'theme-dark', title: 'Switch to Dark Theme', icon: 'dark_mode', onSelect: () => document.documentElement.classList.replace('light', 'dark') },
  ];

  const filteredActions = query === '' 
    ? actions 
    : actions.filter((action) => action.title.toLowerCase().includes(query.toLowerCase()));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].onSelect();
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-surface border border-surface-container-highest rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 border-b border-surface-container-highest">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-0 py-4 pl-3 pr-4 text-body-lg text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:outline-none"
            placeholder="Search commands or jump to..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 bg-surface-container rounded text-[10px] font-mono text-on-surface-variant">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-body-md text-on-surface-variant">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="px-2 space-y-1">
              {filteredActions.map((action, idx) => (
                <li key={action.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      idx === selectedIndex 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-on-surface hover:bg-surface-container-highest'
                    }`}
                    onClick={() => {
                      action.onSelect();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                    <span className="text-body-md font-medium">{action.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
