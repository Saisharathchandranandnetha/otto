import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const WEBHOOK_SECRET = process.env.OTTO_WEBHOOK_SECRET || 'secret-otto-webhook-token';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Secret
    const authHeader = req.headers.get('x-otto-n8n-secret');
    if (authHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Payload from Dify/Telegram (via n8n)
    const payload = await req.json();

    // 3. Process Payload
    // For now, we simulate inserting a processed inquiry into the DB
    // Assuming Dify extracted: { studentName: string, query: string, intent: string }
    const { studentName, query, intent } = payload;
    
    if (studentName && query) {
      console.log(`[Education Webhook] Received Inquiry from ${studentName}: ${query}`);
      
      // We would save this to an education_inquiries table, but for now we log it.
      // Example:
      // await sql`
      //   INSERT INTO education_inquiries (student_name, query, intent, raw_payload)
      //   VALUES (${studentName}, ${query}, ${intent || null}, ${JSON.stringify(payload)})
      // `;
      
      // Optionally broadcast via SSE to the dashboard here...
    }

    return NextResponse.json({ success: true, message: 'Payload received and processed' });
  } catch (error) {
    console.error('[Education Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
