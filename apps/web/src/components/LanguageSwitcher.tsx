'use client';
import { useState, useEffect, useRef } from 'react';
import { getLocale, setLocale, type Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Locale>('en');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getLocale());
    
    // Close on click outside
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Locale) => {
    setLocale(lang);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          open ? 'bg-surface-container-high' : 'hover:bg-surface-container'
        }`}
        aria-label="Change language"
      >
        <span className="material-symbols-outlined text-on-surface-variant">
          language
        </span>
      </button>

      {open && (
        <div className="absolute top-12 left-0 w-48 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg z-50 overflow-hidden animate-slide-in">
          <div className="flex flex-col">
            <button
              onClick={() => handleSelect('en')}
              className="flex justify-between items-center p-4 hover:bg-surface-container-low transition-colors border-b border-surface-container-highest text-left"
            >
              <span className="text-body-md text-on-surface">English</span>
              {current === 'en' && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
            </button>
            <button
              onClick={() => handleSelect('hi')}
              className="flex justify-between items-center p-4 hover:bg-surface-container-low transition-colors border-b border-surface-container-highest text-left"
            >
              <span className="text-body-md text-on-surface">हिन्दी</span>
              {current === 'hi' && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
            </button>
            <button
              onClick={() => handleSelect('te')}
              className="flex justify-between items-center p-4 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="text-body-md text-on-surface">తెలుగు</span>
              {current === 'te' && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
