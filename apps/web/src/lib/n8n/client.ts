export interface N8nWebhookPayload {
  domain: string;
  action: string;
  data: Record<string, any>;
  userId: string;
}

export class N8nClient {
  private baseUrl: string;

  constructor() {
    // In Docker, Next.js can reach n8n at http://n8n:5678
    // Fallback to localhost if running outside Docker
    this.baseUrl = process.env.N8N_INTERNAL_URL || 'http://n8n:5678';
  }

  /**
   * Trigger a webhook in n8n headlessly.
   * @param webhookPath The path of the webhook (e.g., 'workflow-trigger')
   * @param payload The data to send
   */
  async triggerWebhook(webhookPath: string, payload: N8nWebhookPayload) {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/${webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Can add n8n API keys here later if enabled
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[n8n Client] Webhook trigger failed:', error);
      throw error;
    }
  }

  /**
   * Optional: Use the n8n REST API (requires N8N_PUBLIC_API_ACTIVE=true and an API key)
   */
  async executeWorkflow(workflowId: string, data: any) {
    // Implementation for programmatic execution if needed
    throw new Error('Not implemented');
  }
}

export const n8n = new N8nClient();
