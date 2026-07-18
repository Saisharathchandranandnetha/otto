'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Bot, ChevronDown, Sparkles, Zap, Search,
  FileText, BarChart2, RefreshCw, CheckCircle2, Loader2,
  MessageSquare, Wrench
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────── */
type Role = 'user' | 'assistant' | 'tool';

interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: 'running' | 'done' | 'error';
}

interface Message {
  id: string;
  role: Role;
  content: string;
  toolCalls?: ToolCall[];
}

/* ─── Domain config ──────────────────────────────────────────────────── */
export interface DomainConfig {
  slug: string;
  name: string;
  color: string;
  icon?: string;
  tools: ToolDef[];
  greeting: string;
  suggestions: string[];
}

interface ToolDef {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Hardcoded demo result returned when tool is called */
  mockResult: (args: Record<string, unknown>) => string;
}

/* ─── Default domain tools shared across all domains ─────────────────── */
const COMMON_TOOLS: ToolDef[] = [
  {
    name: 'get_metrics',
    description: 'Fetch current KPI metrics for this domain',
    icon: BarChart2,
    mockResult: (args) => JSON.stringify({
      status: 'live',
      domain: args.domain || 'unknown',
      tasksAutomated: 47,
      humanApprovals: 12,
      avgConfidence: 0.94,
      uptime: '99.98%',
      timestamp: new Date().toISOString(),
    }),
  },
  {
    name: 'search_knowledge_base',
    description: 'Search the semantic knowledge base for relevant documents',
    icon: Search,
    mockResult: (args) => JSON.stringify({
      query: args.query,
      results: [
        { title: 'Q2 Operations Report', score: 0.97, snippet: 'Total throughput increased 34% with AI automation...' },
        { title: 'Policy Document v3', score: 0.91, snippet: 'Standard approval threshold set to ₹10,000 per action...' },
        { title: 'Vendor Agreement', score: 0.85, snippet: 'Net-30 payment terms apply to all purchase orders...' },
      ],
    }),
  },
  {
    name: 'list_pending_actions',
    description: 'List all pending AI agent actions awaiting approval',
    icon: RefreshCw,
    mockResult: () => JSON.stringify({
      pending: [
        { id: 'act-001', type: 'reorder', description: 'Reorder 25 units SKU-4821 from Sharma Fabrics', amount: 32400, confidence: 0.96 },
        { id: 'act-002', type: 'send_report', description: 'Send weekly performance report to manager', amount: 0, confidence: 0.99 },
      ],
      count: 2,
    }),
  },
  {
    name: 'generate_document',
    description: 'Generate a business document (report, PO, invoice, summary)',
    icon: FileText,
    mockResult: (args) => JSON.stringify({
      documentId: `DOC-${Date.now().toString(36).toUpperCase()}`,
      type: args.type || 'report',
      status: 'generated',
      preview: `Auto-generated ${args.type || 'report'} for ${new Date().toLocaleDateString()}. Ready for download.`,
      downloadUrl: '#demo',
    }),
  },
];

/* ─── Domain-specific configs ─────────────────────────────────────────── */
const DOMAIN_CONFIGS: Record<string, Partial<DomainConfig>> = {
  education: {
    greeting: "Hi! I'm Otto's Education AI Assistant. I can help you with student analytics, admission workflows, document generation, and trust gate management. What do you need?",
    suggestions: ['Show pending admission approvals', 'Generate student performance report', 'Search knowledge base for fee policy', 'What\'s today\'s automation summary?'],
  },
  healthcare: {
    greeting: "Hello! I'm your Healthcare AI copilot. I can help with triage workflows, patient follow-ups, compliance documents, and clinic automation. How can I assist?",
    suggestions: ['List pending triage actions', 'Search compliance documents', 'Generate patient follow-up report', 'Show today\'s automation metrics'],
  },
  manufacturing: {
    greeting: "Hi! I'm the Manufacturing AI Agent. I monitor preventive maintenance, inventory levels, production workflows, and supplier actions. What do you need today?",
    suggestions: ['Check maintenance alerts', 'List pending reorder actions', 'Generate production summary', 'Search equipment manuals'],
  },
  retail: {
    greeting: "Hello! I'm your Retail AI Assistant. I handle stock replenishment, loyalty campaigns, customer analytics, and supplier reorders. What can I do for you?",
    suggestions: ['Show low-stock alerts', 'Generate loyalty campaign report', 'Search customer purchase history', 'List pending reorder approvals'],
  },
  sales: {
    greeting: "Hi there! I'm the Sales AI copilot. I track deal pipelines, stalled opportunities, follow-up automation, and revenue analytics. How can I help?",
    suggestions: ['Show stalled deals', 'Generate pipeline report', 'Search CRM notes', 'List pending follow-up actions'],
  },
  support: {
    greeting: "Hello! I'm your Customer Support AI. I manage ticket automation, response generation, escalation workflows, and satisfaction analytics. What do you need?",
    suggestions: ['Show open ticket queue', 'Generate support summary report', 'Search ticket resolution policies', 'List pending response actions'],
  },
  legal: {
    greeting: "Hi! I'm the Legal AI Assistant. I help with contract risk analysis, compliance documents, clause comparison, and approval workflows. How can I assist?",
    suggestions: ['Analyse contract risks', 'Generate compliance summary', 'Search clause library', 'List pending document approvals'],
  },
  multilingual: {
    greeting: "Hello! I'm the Multilingual Intelligence assistant. I can help with language coverage, translation previews, and locale configuration. What do you need?",
    suggestions: ['Show translation coverage', 'Preview Hindi translations', 'List incomplete translation keys', 'Get metrics'],
  },
  developer: {
    greeting: "Hey! I'm the Developer SDK assistant. I can help with API usage, code examples, webhook setup, and integration patterns. What are you building?",
    suggestions: ['Show API endpoints', 'Generate Node.js code example', 'Explain webhook setup', 'List available tools'],
  },
};

/* ─── Tool Call Bubble ────────────────────────────────────────────────── */
function ToolCallBubble({ tc }: { tc: ToolCall }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = COMMON_TOOLS.find(t => t.name === tc.name)?.icon || Wrench;

  return (
    <div className="my-1 rounded-xl border border-white/8 bg-white/3 text-xs font-mono overflow-hidden">
      <button
        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        {tc.status === 'running' ? (
          <Loader2 size={11} className="text-amber-400 animate-spin shrink-0" />
        ) : tc.status === 'done' ? (
          <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
        ) : (
          <X size={11} className="text-red-400 shrink-0" />
        )}
        <Icon size={11} className="text-white/40 shrink-0" />
        <span className="text-white/60">{tc.name}</span>
        <span className="ml-auto text-white/25">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && tc.result && (
        <div className="px-3 pb-3 text-white/40 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-2">
          {(() => {
            try {
              return JSON.stringify(JSON.parse(tc.result), null, 2);
            } catch {
              return tc.result;
            }
          })()}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
interface AIAssistantProps {
  domain?: string;
  color?: string;
}

export function AIAssistant({ domain = 'default', color = '#f59e0b' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cfg = DOMAIN_CONFIGS[domain] || {};
  const greeting = cfg.greeting || `Hi! I'm Otto AI for the ${domain} domain. Ask me anything.`;
  const suggestions = cfg.suggestions || ['Show metrics', 'List pending actions', 'Generate report', 'Search documents'];

  // Init greeting
  useEffect(() => {
    setMessages([{ id: 'init', role: 'assistant', content: greeting }]);
  }, [greeting]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  /* ── Execute a tool locally (hardcoded mock) ── */
  const executeTool = useCallback((name: string, args: Record<string, unknown>): string => {
    const tool = COMMON_TOOLS.find(t => t.name === name);
    if (!tool) return JSON.stringify({ error: `Tool "${name}" not found` });
    return tool.mockResult({ ...args, domain });
  }, [domain]);

  /* ── Send message ── */
  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role === 'tool' ? 'assistant' : m.role, content: m.content })),
          domain,
          tools: COMMON_TOOLS.map(t => ({ name: t.name, description: t.description })),
        }),
      });

      const data = await res.json();

      // Handle tool calls from the API
      if (data.toolCalls && data.toolCalls.length > 0) {
        // Show assistant message with pending tool calls
        const toolCalls: ToolCall[] = data.toolCalls.map((tc: any) => ({
          id: tc.id || `tc-${Date.now()}-${Math.random()}`,
          name: tc.name,
          args: tc.args || {},
          status: 'running' as const,
        }));

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.text || `Running ${toolCalls.length} tool${toolCalls.length > 1 ? 's' : ''}…`,
          toolCalls,
        };
        setMessages(prev => [...prev, assistantMsg]);

        // Execute tools sequentially with small delays for demo effect
        const results: string[] = [];
        for (let i = 0; i < toolCalls.length; i++) {
          await new Promise(r => setTimeout(r, 600 + i * 300));
          const result = executeTool(toolCalls[i]!.name, toolCalls[i]!.args);
          results.push(result);

          setMessages(prev => prev.map(m =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  toolCalls: m.toolCalls?.map((tc, idx) =>
                    idx === i ? { ...tc, result, status: 'done' as const } : tc
                  ),
                }
              : m
          ));
        }

        // Final summary response
        await new Promise(r => setTimeout(r, 400));
        const summaryRes = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role === 'tool' ? 'assistant' : m.role, content: m.content })),
              { role: 'user', content: trimmed },
              { role: 'assistant', content: `Tool results: ${results.join(' | ')}` },
              { role: 'user', content: 'Summarize the tool results in a helpful, conversational way.' },
            ],
            domain,
            tools: [],
          }),
        });
        const summaryData = await summaryRes.json();
        setMessages(prev => [...prev, {
          id: `s-${Date.now()}`,
          role: 'assistant',
          content: summaryData.text || 'Here are the results from the tools I ran.',
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.text || 'Sorry, I encountered an error. Please try again.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, domain, executeTool]);

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="w-[360px] max-h-[560px] flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: '#13131a' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)`, borderBottom: `1px solid ${color}30` }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}25` }}>
                <Bot size={15} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Otto AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-mono" style={{ color }}>{domain} assistant</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white/70 transition-colors p-1">
              <X size={15} />
            </button>
          </div>

          {/* Tool legend */}
          <div className="flex gap-1.5 px-4 py-2 border-b border-white/5 shrink-0 overflow-x-auto">
            {COMMON_TOOLS.map(t => {
              const Icon = t.icon;
              return (
                <div
                  key={t.name}
                  title={t.description}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/4 border border-white/6 shrink-0"
                >
                  <Icon size={10} className="text-white/40" />
                  <span className="text-xs font-mono text-white/30">{t.name.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.role === 'user' ? (
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white"
                    style={{ background: `${color}30`, border: `1px solid ${color}40` }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[95%]">
                    <div className="px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-white/80 bg-white/6 border border-white/8 whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </div>
                    {m.toolCalls && m.toolCalls.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.toolCalls.map(tc => (
                          <ToolCallBubble key={tc.id} tc={tc} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-white/6 border border-white/8 flex items-center gap-2">
                  <Loader2 size={12} className="text-white/40 animate-spin" />
                  <span className="text-xs text-white/40 font-mono">thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {suggestions.slice(0, 3).map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/4 border border-white/8 text-white/50 hover:text-white/80 hover:bg-white/8 transition-all font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2 px-3 py-3 border-t border-white/8 shrink-0"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask ${domain} AI…`}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-amber-500/40 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:opacity-80 shrink-0"
              style={{ background: color }}
            >
              <Send size={14} className="text-white" />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 8px 32px ${color}40` }}
      >
        {isOpen ? <X size={16} /> : <><Sparkles size={16} /><span>Otto AI</span></>}
      </button>
    </div>
  );
}
