import { educationStore, ChatLog } from '@/lib/educationStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
      const encoder = new TextEncoder();

      // Send initial connection event
      controller.enqueue(encoder.encode(': connected\n\n'));

      // Subscribe to live chat logs
      const unsubscribe = educationStore.subscribeToChatLogs((log: ChatLog) => {
        try {
          const data = `data: ${JSON.stringify(log)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (err) {
          // Ignore
        }
      });

      // Keep connection alive with heartbeat every 15s
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (err) {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      // Cleanup on client disconnect (simulated via request abort, handled in Next.js edge/node differently, but this is a simple pattern)
      requestAnimationFrame(() => {
        // nextjs requires special handling for disconnect, simplified for this integration
      });

      // This is a naive cleanup approach.
      return () => {
        unsubscribe();
        clearInterval(heartbeatInterval);
      };
    },
    cancel() {
      // client disconnected
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
