import { NextRequest, NextResponse } from 'next/server';

/* ── Domain system prompts ─────────────────────────────────────────────── */
const DOMAIN_PROMPTS: Record<string, string> = {
  education: `You are Otto's Education AI Assistant. You help with student admission workflows, performance analytics, document generation, and trust gate management.
Key context: This domain runs automated pipelines for admission packs, student support tickets, and academic compliance. The trust ladder gates all autonomous actions.`,

  healthcare: `You are Otto's Healthcare AI copilot. You assist with triage workflows, patient follow-up automation, clinic compliance, and appointment scheduling.
Key context: All patient-affecting actions require human approval. The trust gate enforces strict oversight for healthcare operations.`,

  manufacturing: `You are Otto's Manufacturing AI Agent. You monitor preventive maintenance alerts, inventory reorder points, production KPIs, and supplier workflows.
Key context: Maintenance orders above ₹50,000 require manager approval. Reorder actions below cap run autonomously after graduation.`,

  retail: `You are Otto's Retail AI Assistant. You manage stock replenishment, loyalty campaigns, customer analytics, and supplier reorder automation.
Key context: The domain runs for Priya's Fashion, Jaipur. Key suppliers are Sharma Fabrics and Raj Textiles. 8 active customers, ₹8,000 in outstanding dues.`,

  sales: `You are Otto's Sales AI copilot. You track pipeline health, stalled deal detection, automated follow-ups, and revenue analytics.
Key context: Deals stalled >7 days trigger autonomous follow-up drafts. Manager approval required before sending.`,

  support: `You are Otto's Customer Support AI. You manage ticket queues, generate response drafts, handle escalations, and track resolution SLAs.
Key context: First-response automation handles 91% of tickets. Escalations to human agents trigger within 2 hours.`,

  legal: `You are Otto's Legal AI Assistant. You assist with contract risk analysis, clause comparison, compliance document generation, and approval workflows.
Key context: All contract summaries require lawyer review before external distribution. Risk scores above 0.7 auto-escalate.`,

  multilingual: `You are Otto's Multilingual Intelligence assistant. You help with translation coverage, locale configuration, language detection, and i18n pipeline monitoring.`,

  developer: `You are Otto's Developer SDK assistant. You help with API integration, code examples in Node.js and Python, webhook setup, and tool orchestration patterns.`,

  default: `You are the Otto AI Assistant — an intelligent guide for the Otto platform. 
Otto is a production-grade platform for autonomous workflow agents with an earned-trust safety model.
Key features: Visual Workflow Builder, 8 Industry Domains, Trust Ladder safety engine, SSE real-time streaming, schema-locked extraction.`,
};

/* ── Tool definitions sent to LLM ───────────────────────────────────────── */
const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_metrics',
      description: 'Fetch current KPI metrics and performance statistics for this domain',
      parameters: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'The domain to fetch metrics for' },
          period: { type: 'string', enum: ['today', 'week', 'month'], description: 'Time period for metrics' },
        },
        required: ['domain'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_knowledge_base',
      description: 'Search the semantic knowledge base for relevant documents, policies, or records',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language search query' },
          limit: { type: 'number', description: 'Max results to return (default 3)' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_pending_actions',
      description: 'List all AI agent actions currently pending human approval in the trust gate',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['awaiting_approval', 'auto_approved', 'all'] },
        },
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_document',
      description: 'Generate a business document such as a report, purchase order, invoice, or summary',
      parameters: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Document type: report | purchase_order | invoice | summary | compliance' },
          context: { type: 'string', description: 'Additional context for document generation' },
        },
        required: ['type'],
      },
    },
  },
];

/* ── Helper: call OpenRouter ─────────────────────────────────────────────── */
async function callOpenRouter(body: object): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://otto.ai',
      'X-Title': 'Otto AI Assistant',
    },
    body: JSON.stringify(body),
  });
}

/* ── Fallback: rule-based responses when no LLM key ─────────────────────── */
function getRuleBasedResponse(userMessage: string, domain: string, tools: { name: string; description: string }[]): {
  text: string;
  toolCalls?: { id: string; name: string; args: Record<string, unknown> }[];
} {
  const msg = userMessage.toLowerCase();

  // Detect tool intent
  if (msg.includes('metric') || msg.includes('kpi') || msg.includes('stat') || msg.includes('summary') || msg.includes('today')) {
    return {
      text: `Let me pull the current metrics for the ${domain} domain.`,
      toolCalls: [{ id: `tc-${Date.now()}`, name: 'get_metrics', args: { domain, period: 'today' } }],
    };
  }
  if (msg.includes('search') || msg.includes('find') || msg.includes('document') || msg.includes('knowledge') || msg.includes('policy')) {
    const query = userMessage.replace(/search|find|look for|knowledge base/gi, '').trim() || 'relevant policies';
    return {
      text: `Searching the knowledge base for: "${query}"`,
      toolCalls: [{ id: `tc-${Date.now()}`, name: 'search_knowledge_base', args: { query, limit: 3 } }],
    };
  }
  if (msg.includes('pending') || msg.includes('approval') || msg.includes('action') || msg.includes('queue')) {
    return {
      text: 'Fetching all pending actions from the trust gate queue.',
      toolCalls: [{ id: `tc-${Date.now()}`, name: 'list_pending_actions', args: { status: 'awaiting_approval' } }],
    };
  }
  if (msg.includes('generate') || msg.includes('report') || msg.includes('invoice') || msg.includes('po') || msg.includes('purchase')) {
    const type = msg.includes('invoice') ? 'invoice' : msg.includes('purchase') || msg.includes('po') ? 'purchase_order' : 'report';
    return {
      text: `Generating a ${type} for the ${domain} domain.`,
      toolCalls: [{ id: `tc-${Date.now()}`, name: 'generate_document', args: { type, context: `${domain} domain` } }],
    };
  }

  // General responses
  const responses: Record<string, string[]> = {
    education: [
      "The Education domain has 6 AI pillars active: Employee Copilot, Customer Support, Knowledge Assistant, Document Generation, Workflow Agents, and Personalization Engine.",
      "Current trust gate status: 2 actions awaiting approval (admission pack generation and student report). 47 actions auto-approved this week.",
      "The Telegram live feed shows 89 student queries resolved today with 91% first-contact resolution rate.",
    ],
    healthcare: [
      "Healthcare triage queue has 27 follow-up tasks. 19 are auto-scheduled, 8 require clinical review.",
      "Patient workflow automation runs at 94% confidence. All actions above clinical threshold require human approval.",
    ],
    default: [
      `I'm your Otto AI assistant for the ${domain} domain. I can help you get metrics, search documents, review pending actions, or generate reports. Try asking me to "show metrics" or "list pending approvals"!`,
      "Otto's trust engine ensures every autonomous action is capped, logged, and reversible. Want me to show you the current pending actions?",
      `The ${domain} domain is running with all AI pillars active. Ask me to "get today's metrics" or "search the knowledge base" to explore.`,
    ],
  };

  const pool = responses[domain] || responses.default!;
  return { text: pool[Math.floor(Math.random() * pool.length)]! };
}

/* ── Route handler ───────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { messages, domain = 'default', tools: clientTools = [] } = await req.json();

    const systemPrompt = DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS.default;
    const lastUserMsg = messages.findLast?.((m: any) => m.role === 'user')?.content || '';

    // If no tools requested (summary call), just get text
    const includeTools = clientTools.length > 0;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'your_openrouter_api_key_here' && apiKey.length > 10;

    if (!hasValidKey) {
      // Fallback: rule-based with tool detection
      const result = getRuleBasedResponse(lastUserMsg, domain, clientTools);
      return NextResponse.json(result);
    }

    // Try OpenRouter with tool calling
    const requestBody: any = {
      model: 'google/gemini-flash-1.5',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      temperature: 0.7,
      max_tokens: 800,
    };

    if (includeTools) {
      requestBody.tools = TOOL_DEFINITIONS;
      requestBody.tool_choice = 'auto';
    }

    const res = await callOpenRouter(requestBody);

    if (!res.ok) {
      // Fallback on API error
      const result = getRuleBasedResponse(lastUserMsg, domain, clientTools);
      return NextResponse.json(result);
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    const msg = choice?.message;

    if (!msg) {
      return NextResponse.json({ text: 'No response from AI. Please try again.' });
    }

    // Handle tool_calls in response
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const toolCalls = msg.tool_calls.map((tc: any) => ({
        id: tc.id,
        name: tc.function?.name,
        args: (() => { try { return JSON.parse(tc.function?.arguments || '{}'); } catch { return {}; } })(),
      }));

      return NextResponse.json({
        text: msg.content || `Running ${toolCalls.length} tool${toolCalls.length > 1 ? 's' : ''}…`,
        toolCalls,
      });
    }

    return NextResponse.json({ text: msg.content || 'No response.' });
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { text: 'I\'m running in offline mode. Ask me to "show metrics", "list pending actions", "search documents", or "generate a report" to see tool calling in action!' },
      { status: 200 } // Return 200 with fallback so UI doesn't show error
    );
  }
}
