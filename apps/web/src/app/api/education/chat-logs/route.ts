import { NextResponse } from 'next/server';
import { z } from 'zod';
import { educationStore } from '@/lib/educationStore';
import { startTelegramPoller } from '@/lib/telegram-education';

// Strict validation for the incoming n8n webhook payload
const chatLogSchema = z.object({
  user_name: z.string(),
  chat_id: z.string(),
  message: z.string(),
  ai_reply: z.string(),
  topic: z.string().default('general'),
  confidence: z.number().default(0),
  status: z.enum(['resolved', 'escalated', 'pending']).default('resolved'),
  timestamp: z.string().optional(),
  conversation_id: z.string().optional()
});

export async function POST(request: Request) {
  try {
    // Security check: validate the webhook came from our trusted n8n instance
    const secret = request.headers.get('x-otto-secret');
    if (secret !== process.env.OTTO_WEBHOOK_SECRET) {
      console.warn('Unauthorized webhook attempt to /api/education/chat-logs');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = chatLogSchema.parse(body);

    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: validatedData.timestamp || new Date().toISOString(),
      ...validatedData
    };

    // Store in our in-memory cache and broadcast to all connected UI clients (SSE)
    educationStore.addChatLog(logEntry);

    return NextResponse.json({ success: true, id: logEntry.id });
  } catch (error) {
    console.error('Error processing chat log webhook:', error);
    return NextResponse.json(
      { error: 'Invalid payload or internal error' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  startTelegramPoller(); // idempotent — dashboard load boots the live bot bridge
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let logs = educationStore.getChatLogs();

  if (topic) {
    logs = logs.filter(log => log.topic === topic);
  }
  if (status) {
    logs = logs.filter(log => log.status === status);
  }

  const paginatedLogs = logs.slice(0, limit);
  const stats = educationStore.getStats();

  return NextResponse.json({
    logs: paginatedLogs,
    total: logs.length,
    stats
  });
}
