'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Languages, Search, Brain, Globe2, MessageCircle, BarChart2,
  CheckCircle2, AlertCircle, Clock, ArrowRight, Sparkles,
  ChevronRight, TrendingUp, Zap, Shield
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', status: 'active', coverage: 100 },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', status: 'active', coverage: 94 },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳', status: 'active', coverage: 88 },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳', status: 'active', coverage: 85 },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', status: 'active', coverage: 82 },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳', status: 'beta', coverage: 71 },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳', status: 'beta', coverage: 68 },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳', status: 'beta', coverage: 65 },
];

const SAMPLE_TRANSLATIONS = [
  { key: 'approval.reorder.title', en: 'Reorder low-stock items', hi: 'कम स्टॉक वस्तुएँ पुनः मंगाएं', te: 'తక్కువ స్టాక్ వస్తువులను తిరిగి ఆర్డర్ చేయండి' },
  { key: 'trust.graduation.offer', en: 'Otto is ready to handle this autonomously', hi: 'ऑटो इसे स्वायत्त रूप से संभालने के लिए तैयार है', te: 'ఆటో దీన్ని స్వయంచాలకంగా నిర్వహించడానికి సిద్ధంగా ఉంది' },
  { key: 'action.cost_of_delay', en: 'Cost of doing nothing', hi: 'कुछ न करने की कीमत', te: 'ఏమీ చేయకపోవడం వల్ల నష్టం' },
  { key: 'dashboard.welcome', en: 'Welcome back', hi: 'वापसी पर स्वागत है', te: 'తిరిగి స్వాగతం' },
];

export default function MultilingualPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'translations' | 'config'>('overview');
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/20">
            <Languages size={20} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Multilingual Intelligence</h1>
            <p className="text-xs text-white/40 font-mono">8 languages · AI-native translation pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            ● Live
          </span>
          <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Languages', value: '8', sub: '3 in beta', icon: Globe2, color: '#ec4899' },
            { label: 'Translation Keys', value: '1,247', sub: '98.2% complete', icon: MessageCircle, color: '#6366f1' },
            { label: 'Auto-detected', value: '99.1%', sub: 'accuracy rate', icon: Brain, color: '#10b981' },
            { label: 'Avg. Latency', value: '< 2ms', sub: 'i18n lookup', icon: Zap, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40 font-mono">{s.label}</span>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-white/30 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/3 p-1 rounded-xl w-fit">
          {(['overview', 'translations', 'config'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Language list */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider font-mono">Supported Languages</h3>
              <div className="space-y-3">
                {LANGUAGES.map(l => (
                  <div
                    key={l.code}
                    onClick={() => setCurrentLang(l.code)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${currentLang === l.code ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{l.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${l.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {l.status}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div className="h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all" style={{ width: `${l.coverage}%` }} />
                      </div>
                      <span className="text-xs text-white/30 font-mono">{l.coverage}% coverage</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider font-mono">Live Translation Preview</h3>
              <div className="mb-4 flex gap-2 flex-wrap">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setCurrentLang(l.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${currentLang === l.code ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/5 text-white/40 hover:text-white/70'}`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {SAMPLE_TRANSLATIONS.map(t => {
                  const text = (t as any)[currentLang] || t.en;
                  return (
                    <div key={t.key} className="p-3 bg-black/20 rounded-xl border border-white/5">
                      <p className="text-xs font-mono text-white/30 mb-1">{t.key}</p>
                      <p className="text-sm text-white">{text}</p>
                      {currentLang !== 'en' && (
                        <p className="text-xs text-white/25 mt-1 italic">EN: {t.en}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'translations' && (
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
              <Search size={14} className="text-white/40" />
              <input placeholder="Search translation keys…" className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1 font-mono" />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-mono text-white/30 uppercase tracking-wider">Key</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-wider">English</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-wider">Hindi</th>
                  <th className="text-left px-4 py-3 text-xs font-mono text-white/30 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_TRANSLATIONS.map((t, i) => (
                  <tr key={t.key} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? 'bg-white/1' : ''}`}>
                    <td className="px-5 py-3 font-mono text-xs text-pink-400">{t.key}</td>
                    <td className="px-4 py-3 text-white/70">{t.en}</td>
                    <td className="px-4 py-3 text-white/70">{t.hi}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 font-mono uppercase tracking-wider">Detection Pipeline</h3>
              <div className="space-y-3">
                {[
                  { step: '1', label: 'Browser Accept-Language header', status: 'primary' },
                  { step: '2', label: 'User profile locale preference', status: 'secondary' },
                  { step: '3', label: 'LLM language detection fallback', status: 'fallback' },
                  { step: '4', label: 'Default: English (en)', status: 'default' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-mono flex items-center justify-center">{item.step}</span>
                    <span className="text-sm text-white/70">{item.label}</span>
                    <span className="ml-auto text-xs font-mono text-white/30">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 font-mono uppercase tracking-wider">i18n Config</h3>
              <pre className="text-xs font-mono text-white/60 bg-black/30 rounded-xl p-4 leading-relaxed overflow-auto">
{`// src/lib/i18n.ts
export const LOCALES = [
  'en', 'hi', 'te',
  'ta', 'bn', 'mr',
  'gu', 'kn'
] as const;

export const DEFAULT_LOCALE = 'en';

export type Locale = 
  typeof LOCALES[number];`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
