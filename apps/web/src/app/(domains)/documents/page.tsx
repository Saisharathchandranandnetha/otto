'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Sparkles, CheckCircle2, Clock, BarChart2, User, Building2, ArrowRight, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { id: 'po', name: 'Purchase Order', icon: '📦', desc: 'Auto-generated from approved reorder action', fields: ['supplier', 'items', 'total', 'delivery_date'], color: '#f59e0b' },
  { id: 'invoice', name: 'Sales Invoice', icon: '🧾', desc: 'GST-compliant invoice with QR code', fields: ['customer', 'items', 'tax', 'due_date'], color: '#10b981' },
  { id: 'credit_note', name: 'Credit Note', icon: '💳', desc: 'Generated on undo of confirmed sale', fields: ['original_invoice', 'reason', 'amount'], color: '#6366f1' },
  { id: 'statement', name: 'Account Statement', icon: '📊', desc: 'Customer dues summary with ledger trail', fields: ['customer', 'period', 'entries', 'balance'], color: '#ec4899' },
  { id: 'compliance', name: 'GST Summary Report', icon: '🏛️', desc: 'Monthly GSTIN-compliant summary', fields: ['period', 'outward', 'inward', 'itc'], color: '#a855f7' },
];

const GENERATED = [
  { id: 'PO-2026-041', type: 'Purchase Order', customer: 'Sharma Fabrics', amount: '₹32,400', date: '2 mins ago', status: 'sent', action: 'Reorder — Silk Saree (25 units)' },
  { id: 'INV-2026-118', type: 'Sales Invoice', customer: 'Rahul Sharma', amount: '₹8,200', date: '1 hour ago', status: 'delivered', action: 'Sale — Embroidered Kurta Set' },
  { id: 'STMT-JUL-08', type: 'Account Statement', customer: 'Meera Boutique', amount: '₹0', date: '3 hours ago', status: 'delivered', action: 'Monthly dues statement' },
  { id: 'PO-2026-040', type: 'Purchase Order', customer: 'Raj Textiles', amount: '₹18,750', date: 'Yesterday', status: 'sent', action: 'Reorder — Cotton Fabric (50m)' },
];

export default function DocumentGenerationPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(prev => [...prev, id]);
      setPreviewDoc(id);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/20">
            <FileText size={20} className="text-teal-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Document Generation</h1>
            <p className="text-xs text-white/40 font-mono">5 templates · Auto-triggered from agent actions</p>
          </div>
        </div>
        <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors">← Dashboard</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Generated Today', value: '23', color: '#14b8a6' },
            { label: 'Templates Active', value: '5', color: '#6366f1' },
            { label: 'Auto-triggered', value: '19', color: '#10b981' },
            { label: 'WhatsApp Delivered', value: '17', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4">
              <p className="text-xs text-white/40 font-mono mb-2">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Templates */}
          <div>
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">Document Templates</h3>
            <div className="space-y-3">
              {TEMPLATES.map(t => (
                <div key={t.id} className="bg-white/3 border border-white/8 rounded-2xl p-4 flex items-start gap-4 hover:border-white/15 transition-all">
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-medium text-white text-sm">{t.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono shrink-0" style={{ background: `${t.color}15`, color: t.color }}>
                        {t.fields.length} fields
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mb-3">{t.desc}</p>
                    <button
                      onClick={() => handleGenerate(t.id)}
                      disabled={generating !== null}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      style={{ background: `${t.color}15`, color: t.color }}
                    >
                      {generating === t.id ? (
                        <><Loader2 size={11} className="animate-spin" /> Generating…</>
                      ) : generated.includes(t.id) ? (
                        <><CheckCircle2 size={11} /> Generated</>
                      ) : (
                        <><Sparkles size={11} /> Generate Preview</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent generated + preview */}
          <div className="space-y-4">
            {/* Preview panel */}
            {previewDoc && (
              <div className="bg-white/3 border border-teal-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-teal-400" />
                    <span className="text-sm font-medium text-teal-300">Document Generated</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
                    <Download size={11} /> Download PDF
                  </button>
                </div>
                <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-white/60 leading-relaxed">
                  <p className="text-teal-400 mb-2">{'// OTTO AUTO-GENERATED DOCUMENT'}</p>
                  <p>Template: <span className="text-white">{TEMPLATES.find(t => t.id === previewDoc)?.name}</span></p>
                  <p>Generated: <span className="text-white">{new Date().toLocaleTimeString()}</span></p>
                  <p>Agent Action: <span className="text-amber-400">action_id#demo-{Math.floor(Math.random()*900)+100}</span></p>
                  <p className="mt-2 text-white/30">{'─'.repeat(36)}</p>
                  <p className="mt-2 text-white">Priya&apos;s Fashion, Jaipur</p>
                  <p>GSTIN: 08AABCP1234R1ZX</p>
                  <p className="mt-2">Supplier: <span className="text-amber-400">Sharma Fabrics</span></p>
                  <p>Items: 25× Silk Sarees @ ₹1,296</p>
                  <p>Total: <span className="text-white font-bold">₹32,400.00</span></p>
                  <p className="text-white/30 mt-2">{'─'.repeat(36)}</p>
                  <p className="text-teal-400 mt-1">Status: SENT via WhatsApp ✓</p>
                </div>
              </div>
            )}

            {/* Recent list */}
            <div>
              <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">Recently Generated</h3>
              <div className="space-y-2">
                {GENERATED.map(doc => (
                  <div key={doc.id} className="bg-white/3 border border-white/8 rounded-xl p-3 flex items-center gap-3 hover:border-white/15 transition-all cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-white">{doc.id}</span>
                        <span className="text-xs text-white/30">·</span>
                        <span className="text-xs text-white/50">{doc.type}</span>
                      </div>
                      <p className="text-xs text-white/30 truncate">{doc.action}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-white">{doc.amount}</p>
                      <div className="flex items-center gap-1 justify-end">
                        {doc.status === 'sent' ? (
                          <span className="text-xs text-amber-400 font-mono">● sent</span>
                        ) : (
                          <span className="text-xs text-emerald-400 font-mono">✓ delivered</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
