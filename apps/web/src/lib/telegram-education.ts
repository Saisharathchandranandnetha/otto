// Telegram → Education dashboard bridge.
// Long-polls the Telegram Bot API (no public webhook URL needed), auto-replies
// with an education FAQ agent, and pushes every exchange into educationStore —
// which broadcasts to the dashboard over SSE in real time.
import { educationStore } from './educationStore';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API = `https://api.telegram.org/bot${TOKEN}`;

/* ── Education FAQ agent (rule-based, zero external dependencies) ── */

interface Intent {
  topic: string;
  keywords: string[];
  reply: string;
  confidence: number;
}

const INTENTS: Intent[] = [
  {
    topic: 'greeting', confidence: 0.99,
    keywords: ['/start', 'hi', 'hello', 'hey', 'namaste'],
    reply: 'Hello! 👋 I am the Otto Education Assistant. I can help you with:\n\n• Admissions & deadlines\n• Fee payments\n• Exams & results\n• Timetables\n• Transport & library\n• Parent-Teacher meetings\n\nJust ask me anything!',
  },
  {
    topic: 'admission', confidence: 0.95,
    keywords: ['admission', 'admissions', 'enroll', 'apply', 'seat', 'deadline'],
    reply: 'Admissions for 2026–27 are open! 🎓 The deadline for 10th grade admission is August 15th, 2026. Apply online at portal.school.edu/admissions or visit the office Mon–Fri, 9 AM–4 PM.',
  },
  {
    topic: 'fees', confidence: 0.92,
    keywords: ['fee', 'fees', 'payment', 'pay', 'tuition', 'concession'],
    reply: 'You can pay fees at portal.school.edu/fees 💳 Term 1 fees are due July 30th. UPI, cards and net-banking are accepted. For concessions, write to accounts@school.edu.',
  },
  {
    topic: 'exam', confidence: 0.93,
    keywords: ['exam', 'exams', 'test', 'hall ticket', 'midterm', 'mid-term'],
    reply: 'Mid-term exams start September 8th, 2026. 📝 The full schedule is at portal.school.edu/exams. Hall tickets are issued one week before the first exam.',
  },
  {
    topic: 'results', confidence: 0.93,
    keywords: ['result', 'results', 'marks', 'grade', 'score', 'revaluation'],
    reply: 'Results are published at portal.school.edu/results. 📊 Last term\'s results were released June 20th. Re-evaluation requests must be filed within 7 days.',
  },
  {
    topic: 'timetable', confidence: 0.9,
    keywords: ['timetable', 'time table', 'schedule', 'class timing', 'school hours', 'timing'],
    reply: 'Class timetables are at portal.school.edu/timetable. 🕗 School hours: 8:30 AM–3:30 PM, Mon–Sat (2nd Saturday off).',
  },
  {
    topic: 'transport', confidence: 0.9,
    keywords: ['bus', 'transport', 'route', 'pickup', 'drop'],
    reply: 'School transport runs 12 routes. 🚌 Route maps and stop timings: portal.school.edu/transport. For route changes, contact transport@school.edu.',
  },
  {
    topic: 'library', confidence: 0.9,
    keywords: ['library', 'book', 'books', 'textbook'],
    reply: 'The library is open 8 AM–5 PM on school days. 📚 Textbook lists for 2026–27 are at portal.school.edu/books.',
  },
  {
    topic: 'ptm', confidence: 0.9,
    keywords: ['ptm', 'parent', 'teacher meeting', 'meet teacher', 'appointment'],
    reply: 'The next Parent-Teacher Meeting is August 2nd, 2026, 10 AM–1 PM. 🤝 Book your slot at portal.school.edu/ptm.',
  },
  {
    topic: 'holiday', confidence: 0.9,
    keywords: ['holiday', 'holidays', 'vacation', 'leave', 'calendar'],
    reply: 'The holiday calendar is at portal.school.edu/calendar. 🎉 Next holiday: Independence Day, August 15th.',
  },
];

const ESCALATION_REPLY =
  'Thanks for reaching out! 🙏 I\'ve forwarded your question to our staff — someone will get back to you shortly. You can also call the office at +91-40-1234-5678 (Mon–Fri, 9 AM–4 PM).';

export function classifyMessage(text: string): { topic: string; reply: string; confidence: number; status: 'resolved' | 'escalated' } {
  const lower = text.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => lower.includes(k))) {
      return { topic: intent.topic, reply: intent.reply, confidence: intent.confidence, status: 'resolved' };
    }
  }
  return { topic: 'general', reply: ESCALATION_REPLY, confidence: 0.4, status: 'escalated' };
}

/* ── Long-poll loop (singleton, survives HMR via globalThis) ── */

declare global {
  // eslint-disable-next-line no-var
  var __ottoTelegramPoller: { running: boolean; offset: number } | undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendReply(chatId: number, text: string) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((e) => console.error('[telegram] sendMessage failed:', e));
}

async function handleUpdate(update: any) {
  const msg = update.message;
  if (!msg?.text || !msg.chat) return;

  const userName = [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') || msg.from?.username || 'Unknown';
  const { topic, reply, confidence, status } = classifyMessage(msg.text);

  await sendReply(msg.chat.id, reply);

  educationStore.addChatLog({
    user_name: userName,
    chat_id: String(msg.chat.id),
    message: msg.text,
    ai_reply: reply,
    topic,
    confidence,
    timestamp: new Date().toISOString(),
    status,
  });
  console.log(`[telegram] ${userName}: "${msg.text}" → ${topic} (${status})`);
}

async function pollLoop() {
  const state = globalThis.__ottoTelegramPoller!;
  console.log('[telegram] education bot poller started');
  while (state.running) {
    try {
      const res = await fetch(`${API}/getUpdates?timeout=25&offset=${state.offset}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          state.offset = update.update_id + 1;
          await handleUpdate(update);
        }
      } else if (!data.ok) {
        console.error('[telegram] getUpdates error:', data.description);
        await sleep(5000);
      }
    } catch (e) {
      console.error('[telegram] poll error, retrying in 5s');
      await sleep(5000);
    }
  }
}

/** Idempotent — safe to call from any API route; starts the poller once. */
export function startTelegramPoller() {
  if (!TOKEN) return;
  if (globalThis.__ottoTelegramPoller?.running) return;
  globalThis.__ottoTelegramPoller = { running: true, offset: 0 };
  pollLoop();
}
