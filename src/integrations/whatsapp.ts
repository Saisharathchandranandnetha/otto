// WhatsApp out-channel. WHATSAPP_MODE=sandbox → real Twilio sandbox send;
// WHATSAPP_MODE=simulated → in-app SimulatedWhatsAppPane (rendered from the
// whatsapp_send agent_event, ALWAYS labeled as a mirror — never let a judge
// discover an undisclosed simulation). Same interface either way.
import { getEnv } from '@/lib/env';
import { emitAgentEvent } from '@/lib/sse';

export interface WhatsAppSend {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppResult {
  mode: 'sandbox' | 'simulated';
  sid?: string;
}

export async function sendWhatsApp(msg: WhatsAppSend): Promise<WhatsAppResult> {
  const env = getEnv();
  const mode = env.WHATSAPP_MODE;

  let result: WhatsAppResult;
  if (mode === 'sandbox' && env.TWILIO_ACCOUNT_SID) {
    // Dynamic import prevents build failure when twilio is uninstalled
    const twilio = (await import('twilio')).default;
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const sent = await client.messages.create({
      from: env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886',
      to: msg.to,
      body: msg.body,
      ...(msg.mediaUrl ? { mediaUrl: [msg.mediaUrl] } : {}),
    });
    result = { mode: 'sandbox', sid: sent.sid };
  } else {
    result = { mode: 'simulated' };
  }

  // Every outbound message lands in the trace + the (simulated) pane
  await emitAgentEvent({
    actionId: null,
    fromState: null,
    toState: 'whatsapp_send',
    detail: {
      to: msg.to,
      body: msg.body.slice(0, 300),
      mode: result.mode,
      sid: result.sid ?? null,
    },
  });

  return result;
}
