'use client';
// Settings view — matching the Stitch design perfectly.
import { useState } from 'react';
import { AppShell } from '@/components/AppShell';

export default function SettingsPage() {
  const [lang, setLang] = useState('en');

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-2xl px-container-padding pt-[24px] pb-stack-lg flex flex-col gap-stack-md">
        {/* Page Title */}
        <div>
          <h2 className="text-headline-lg-mobile font-bold text-on-surface">Settings</h2>
        </div>

        {/* Business Profile Section */}
        <section className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-[0_4px_16px_rgba(156,62,38,0.03)] overflow-hidden">
          <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">storefront</span>
              </div>
              <div>
                <h3 className="text-label-lg text-on-surface">Otto General Store</h3>
                <p className="text-label-sm text-on-surface-variant">Business Profile</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
          <div className="p-4 flex justify-between items-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h3 className="text-label-lg text-on-surface">Account Owner</h3>
                <p className="text-label-sm text-on-surface-variant">Personal details</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
        </section>

        {/* WhatsApp Integration Section */}
        <section className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
            <div className="flex-1">
              <h3 className="text-headline-sm text-on-surface">WhatsApp Assistant</h3>
              <p className="text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Connected
              </p>
            </div>
          </div>
          <div className="bg-surface-container rounded-lg p-3 border border-surface-variant/50">
            <p className="text-label-lg font-normal text-on-surface-variant">
              Otto gently syncs with your business chats to log transactions. Your personal messages remain fully private and untouched.
            </p>
          </div>
        </section>

        {/* Autonomy & Trust Section */}
        <section className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-4">
          <h3 className="text-headline-sm text-on-surface mb-4">Autonomy &amp; Trust</h3>
          <div className="flex flex-col gap-4">
            
            {/* Item 1 */}
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant">
              <div className="flex-1 pr-4">
                <h4 className="text-label-lg text-on-surface">Supplier Payments</h4>
                <p className="text-label-sm text-on-surface-variant mt-1">
                  <span className="inline-block px-2 py-0.5 bg-primary-container/20 text-primary rounded text-[10px] uppercase font-bold tracking-wider mr-1">Autonomous</span>
                  Up to ₹5,000 daily
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle1"
                  defaultChecked
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer transition-all duration-300 z-10 top-0 right-0"
                />
                <label
                  htmlFor="toggle1"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer transition-colors duration-300"
                ></label>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex justify-between items-center pb-2">
              <div className="flex-1 pr-4">
                <h4 className="text-label-lg text-on-surface">Customer Reminders</h4>
                <p className="text-label-sm text-on-surface-variant mt-1">
                  <span className="inline-block px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded text-[10px] uppercase font-bold tracking-wider mr-1">Gated</span>
                  Requires approval
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle2"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-surface-variant appearance-none cursor-pointer transition-all duration-300 z-10 top-0 left-0"
                />
                <label
                  htmlFor="toggle2"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300"
                ></label>
              </div>
            </div>
            
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm overflow-hidden mb-8">
          <h3 className="text-headline-sm text-on-surface p-4 pb-2">Language</h3>
          <div className="flex flex-col">
            <button
              onClick={() => setLang('en')}
              className="flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors border-b border-surface-variant text-left"
            >
              <span className="text-body-md text-on-surface">English</span>
              {lang === 'en' && <span className="material-symbols-outlined text-primary">check</span>}
            </button>
            <button
              onClick={() => setLang('hi')}
              className="flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors border-b border-surface-variant text-left"
            >
              <span className="text-body-md text-on-surface">हिन्दी</span>
              {lang === 'hi' && <span className="material-symbols-outlined text-primary">check</span>}
            </button>
            <button
              onClick={() => setLang('te')}
              className="flex justify-between items-center p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="text-body-md text-on-surface">తెలుగు</span>
              {lang === 'te' && <span className="material-symbols-outlined text-primary">check</span>}
            </button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
