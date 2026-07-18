'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, Copy, CheckCircle2, Terminal, Book, Zap, Globe, ArrowRight, Shield } from 'lucide-react';

const SDK_LANGS = [
  { id: 'node', label: 'Node.js', icon: '🟢' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'curl', label: 'cURL', icon: '🌐' },
];

const CODE_SAMPLES: Record<string, string> = {
  node: `import { OttoClient } from '@otto-ai/sdk';

const otto = new OttoClient({
  apiKey: process.env.OTTO_API_KEY,
  baseUrl: 'https://api.otto.ai/v2',
});

// Trigger an agent action
const action = await otto.actions.create({
  type: 'reorder',
  payload: {
    productId: 'SKU-4821',
    quantity: 25,
    supplierId: 'sharma-fabrics',
  },
});

// Wait for approval
const result = await otto.actions.waitForApproval(
  action.id,
  { timeout: 30_000 }
);

console.log(result.status); // 'approved' | 'rejected'`,

  python: `from otto_ai import OttoClient

otto = OttoClient(
    api_key=os.environ["OTTO_API_KEY"],
    base_url="https://api.otto.ai/v2",
)

# Trigger an agent action
action = otto.actions.create(
    type="reorder",
    payload={
        "product_id": "SKU-4821",
        "quantity": 25,
        "supplier_id": "sharma-fabrics",
    }
)

# Subscribe to SSE events
for event in otto.events.stream(action_id=action.id):
    print(event.state, event.detail)`,

  curl: `# Trigger a reorder action
curl -X POST https://api.otto.ai/v2/agent/actions \\
  -H "Authorization: Bearer $OTTO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "reorder",
    "payload": {
      "productId": "SKU-4821",
      "quantity": 25,
      "supplierId": "sharma-fabrics"
    }
  }'

# Stream SSE events
curl -N https://api.otto.ai/v2/events \\
  -H "Authorization: Bearer $OTTO_API_KEY" \\
  -H "Accept: text/event-stream"`,
};

const ENDPOINTS = [
  { method: 'GET', path: '/api/feed', desc: 'List all pending action cards', auth: 'JWT' },
  { method: 'POST', path: '/api/agent/actions', desc: 'Create a new agent action', auth: 'API Key' },
  { method: 'POST', path: '/api/approve', desc: 'Approve or reject an action', auth: 'JWT' },
  { method: 'GET', path: '/api/events', desc: 'Server-Sent Events stream', auth: 'JWT' },
  { method: 'GET', path: '/api/trust', desc: 'Get trust ladder state', auth: 'JWT' },
  { method: 'POST', path: '/api/hooks/{id}', desc: 'Trigger a workflow webhook', auth: 'API Key' },
  { method: 'GET', path: '/api/workflows', desc: 'List all published workflows', auth: 'API Key' },
  { method: 'POST', path: '/api/ingest', desc: 'Ingest documents for Resurrection', auth: 'JWT' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: '#10b981',
  POST: '#6366f1',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
};

export default function DeveloperSDKPage() {
  const [lang, setLang] = useState('node');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SAMPLES[lang] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
            <Code2 size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Developer SDK & API</h1>
            <p className="text-xs text-white/40 font-mono">REST · SSE · Node.js · Python · cURL</p>
          </div>
        </div>
        <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors">← Dashboard</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'API Endpoints', value: '8', icon: Globe, color: '#6366f1' },
            { label: 'SDK Languages', value: '2', icon: Code2, color: '#10b981' },
            { label: 'Auth Methods', value: 'JWT + API Key', icon: Shield, color: '#f59e0b' },
            { label: 'Avg Latency', value: '< 50ms', icon: Zap, color: '#ec4899' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 font-mono">{s.label}</span>
                <s.icon size={13} style={{ color: s.color }} />
              </div>
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Code sample */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider">Quick Start</h3>
              <div className="flex gap-1">
                {SDK_LANGS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${lang === l.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/40 hover:text-white/70'}`}
                  >
                    {l.icon} {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative bg-black/40 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs font-mono text-white/25">
                  {lang === 'node' ? 'index.ts' : lang === 'python' ? 'main.py' : 'request.sh'}
                </span>
                <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                  {copied ? <CheckCircle2 size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-white/70 leading-relaxed overflow-x-auto">
                <code>{CODE_SAMPLES[lang]}</code>
              </pre>
            </div>

            {/* Install */}
            <div className="mt-4 bg-black/30 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <Terminal size={13} className="text-indigo-400 shrink-0" />
              <code className="text-xs font-mono text-white/60">
                {lang === 'python' ? 'pip install otto-ai' : lang === 'node' ? 'pnpm add @otto-ai/sdk' : '# No install needed'}
              </code>
            </div>
          </div>

          {/* API Reference */}
          <div>
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">API Reference</h3>
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {ENDPOINTS.map(ep => (
                  <div key={ep.path} className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded w-14 text-center shrink-0"
                      style={{ background: `${METHOD_COLORS[ep.method]}15`, color: METHOD_COLORS[ep.method] }}
                    >
                      {ep.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-white">{ep.path}</p>
                      <p className="text-xs text-white/35 truncate">{ep.desc}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-mono shrink-0">{ep.auth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook example */}
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">Webhook Trigger</span>
              </div>
              <pre className="text-xs font-mono text-white/60 leading-relaxed">
{`POST /api/hooks/wfh_abc123xyz
Authorization: Bearer <api-key>

{
  "event": "reorder.needed",
  "productId": "SKU-4821"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
