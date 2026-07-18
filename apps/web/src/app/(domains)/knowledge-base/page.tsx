'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, Search, FileText, Layers, Cpu, CheckCircle2, ArrowRight, Sparkles, BarChart2 } from 'lucide-react';

const DOCS = [
  { id: '1', title: 'Priya\'s Fashion — Q3 Supplier Agreement', type: 'Contract', chunks: 12, similarity: 0.97, preview: 'Payment terms: Net-30 from invoice date. Minimum order: ₹25,000. Returns accepted within 14 days with original packaging...' },
  { id: '2', title: 'Sharma Fabrics — Product Catalog 2026', type: 'Catalog', chunks: 34, similarity: 0.91, preview: 'Silk sarees: ₹2,400–₹8,500. Cotton kurtas: ₹450–₹1,200. Embroidered dupattas: ₹800–₹3,000. Bulk discount: 15% on orders over 50 units...' },
  { id: '3', title: 'Inventory Audit — June 2026', type: 'Report', chunks: 8, similarity: 0.88, preview: 'Discrepancy noted: 12 units of SKU-4821 missing from shelf count vs ledger. Recommended: physical recount and supplier verification...' },
  { id: '4', title: 'GST Filing — Q2 2026', type: 'Compliance', chunks: 22, similarity: 0.85, preview: 'GSTIN: 08AABCP1234R1ZX. Total outward supply: ₹4,82,000. Input tax credit claimed: ₹28,340. Net tax payable: ₹46,220...' },
  { id: '5', title: 'WhatsApp Business Export — July 2026', type: 'Chat', chunks: 67, similarity: 0.79, preview: 'Rahul Sharma: "Bhai, wo blue kurta ka stock aaya kya?" | Otto: "Haan, 15 units received. Chahiye?" | Rahul: "5 rakh do..."' },
];

const QUERY_EXAMPLES = [
  'What are Sharma Fabrics\' return terms?',
  'Show all invoices above ₹50,000 from last month',
  'Which customers have overdue payments?',
  'What was our best-selling product in Q2?',
];

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const handleSearch = (q?: string) => {
    setQuery(q || query);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/20">
            <Database size={20} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Semantic Knowledge Base</h1>
            <p className="text-xs text-white/40 font-mono">pgvector · RAG pipeline · 1,247 chunks indexed</p>
          </div>
        </div>
        <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors">← Dashboard</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Documents', value: '5', icon: FileText, color: '#a855f7' },
            { label: 'Vector Chunks', value: '1,247', icon: Layers, color: '#6366f1' },
            { label: 'Embedding Model', value: 'text-3-large', icon: Cpu, color: '#10b981' },
            { label: 'Avg. Query Time', value: '38ms', icon: BarChart2, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 font-mono">{s.label}</span>
                <s.icon size={13} style={{ color: s.color }} />
              </div>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Semantic search bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Ask anything about your business documents…"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-purple-500/40 transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-5 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-xl text-sm font-medium transition-all"
            >
              Search
            </button>
          </div>

          {/* Example queries */}
          <div className="flex flex-wrap gap-2 mt-3">
            {QUERY_EXAMPLES.map(q => (
              <button
                key={q}
                onClick={() => handleSearch(q)}
                className="px-3 py-1.5 bg-white/3 hover:bg-white/6 border border-white/8 rounded-lg text-xs text-white/40 hover:text-white/70 transition-all font-mono"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Results or document list */}
        <div className="grid md:grid-cols-5 gap-5">
          {/* Doc list */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
              {searched ? `Results for "${query || 'Sharma Fabrics return terms'}"` : 'Indexed Documents'}
            </h3>
            {DOCS.map(doc => (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeDoc === doc.id ? 'border-purple-500/30 bg-purple-500/8' : 'border-white/8 bg-white/3 hover:border-white/15'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-white leading-tight">{doc.title}</h4>
                  {searched && (
                    <span className="text-xs font-mono text-purple-400 shrink-0">{(doc.similarity * 100).toFixed(0)}%</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono">{doc.type}</span>
                  <span className="text-xs text-white/25 font-mono">{doc.chunks} chunks</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preview panel */}
          <div className="md:col-span-3">
            {activeDoc ? (
              (() => {
                const doc = DOCS.find(d => d.id === activeDoc)!;
                return (
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-5 h-full">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/8">
                      <div>
                        <h3 className="font-semibold text-white">{doc.title}</h3>
                        <p className="text-xs text-white/30 font-mono mt-0.5">{doc.type} · {doc.chunks} chunks · pgvector indexed</p>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>

                    {searched && (
                      <div className="mb-4 p-3 bg-purple-500/8 border border-purple-500/20 rounded-xl">
                        <p className="text-xs font-mono text-purple-300 mb-1">Semantic Match — {(doc.similarity * 100).toFixed(1)}% relevance</p>
                        <p className="text-sm text-white/70">Query matched via reciprocal rank fusion across {doc.chunks} vector chunks using text-embedding-3-large (3072 dimensions).</p>
                      </div>
                    )}

                    <div className="bg-black/20 rounded-xl p-4 mb-4">
                      <p className="text-xs font-mono text-white/30 mb-2">Extracted Content Preview</p>
                      <p className="text-sm text-white/70 leading-relaxed">{doc.preview}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['Chunk 1', 'Chunk 2', 'Chunk 3'].map((c, i) => (
                        <div key={c} className="p-3 bg-black/20 rounded-lg border border-white/5">
                          <p className="text-xs font-mono text-purple-400 mb-1">{c}</p>
                          <div className="w-full bg-white/5 rounded-full h-1 mb-1">
                            <div className="h-1 rounded-full bg-purple-500" style={{ width: `${85 - i * 12}%` }} />
                          </div>
                          <p className="text-xs text-white/25 font-mono">{85 - i * 12}% relevance</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-2xl bg-purple-500/10 mb-4">
                  <Sparkles size={24} className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Semantic Search Ready</h3>
                <p className="text-sm text-white/40 max-w-xs">
                  Type a natural language query or click a document to preview its vector embeddings and chunk relevance scores.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-mono text-white/25">
                  <Database size={11} className="text-purple-400/50" />
                  pgvector · 1536-dim embeddings · cosine similarity
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
