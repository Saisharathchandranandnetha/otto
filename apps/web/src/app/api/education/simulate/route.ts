// Demo fallback: simulate an incoming student message through the same
// classify → reply → store pipeline used by the real Telegram bridge.
// POST { name?, message? } — random sample used when omitted.
import { NextRequest, NextResponse } from 'next/server';
import { educationStore } from '@/lib/educationStore';
import { classifyMessage } from '@/lib/telegram-education';

const SAMPLES = [
  { name: 'Ananya R.', message: 'When is the last date for admission?' },
  { name: 'Rahul V.', message: 'How do I pay the term fees online?' },
  { name: 'Priya S.', message: 'When do mid-term exams start?' },
  { name: 'Kiran T.', message: 'What time does the school bus reach Madhapur?' },
  { name: 'Sneha D.', message: 'My daughter lost her textbook, what do I do?' },
  { name: 'Vikram J.', message: 'Can I meet the class teacher this week?' },
];

export async function POST(req: NextRequest) {
  let name: string | undefined;
  let message: string | undefined;
  try {
    const body = await req.json();
    name = body.name;
    message = body.message;
  } catch { /* use random sample */ }

  const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)]!;
  const finalName = name || sample.name;
  const finalMessage = message || sample.message;
  const { topic, reply, confidence, status } = classifyMessage(finalMessage);

  const log = educationStore.addChatLog({
    user_name: finalName,
    chat_id: String(90000 + Math.floor(Math.random() * 9999)),
    message: finalMessage,
    ai_reply: reply,
    topic,
    confidence,
    timestamp: new Date().toISOString(),
    status,
  });

  return NextResponse.json({ success: true, log });
}
