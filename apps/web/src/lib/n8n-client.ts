export interface ExecutionSummary {
  id: string;
  finished: boolean;
  mode: string;
  retryOf: string;
  retrySuccessId: string;
  status: 'running' | 'success' | 'error' | 'waiting' | 'canceled';
  startedAt: string;
  stoppedAt: string;
  workflowId: string;
  timeSince?: string;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const n8nClient = {
  
  getAuthHeaders() {
    return {
      'X-N8N-API-KEY': process.env.N8N_API_KEY || '',
      'Content-Type': 'application/json'
    };
  },

  getBaseUrl() {
    return process.env.N8N_BASE_URL || 'http://localhost:5678';
  },

  async getExecutions(workflowId?: string, limit = 20) {
    try {
      const url = new URL(`${this.getBaseUrl()}/api/v1/executions`);
      url.searchParams.append('limit', limit.toString());
      if (workflowId) {
        url.searchParams.append('workflowId', workflowId);
      }

      const res = await fetch(url.toString(), {
        headers: this.getAuthHeaders(),
        // next: { revalidate: 10 } // Optional caching
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch executions: ${res.statusText}`);
      }
      
      const data = await res.json();
      return data.data as ExecutionSummary[];
    } catch (e) {
      console.error('n8nClient.getExecutions error:', e);
      return [];
    }
  },

  async getExecution(executionId: string) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/v1/executions/${executionId}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch execution ${executionId}: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (e) {
      console.error(`n8nClient.getExecution(${executionId}) error:`, e);
      return null;
    }
  },

  async getWorkflow(workflowId: string) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/v1/workflows/${workflowId}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch workflow ${workflowId}: ${res.statusText}`);
      }
      
      return await res.json() as WorkflowSummary;
    } catch (e) {
      console.error(`n8nClient.getWorkflow(${workflowId}) error:`, e);
      return null;
    }
  },

  async getWorkflows() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/v1/workflows?active=true`, {
        headers: this.getAuthHeaders()
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch workflows: ${res.statusText}`);
      }
      
      const data = await res.json();
      return data.data as WorkflowSummary[];
    } catch (e) {
      console.error('n8nClient.getWorkflows error:', e);
      return [];
    }
  },

  async triggerWorkflow(workflowId: string, data: Record<string, unknown>) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/v1/workflows/${workflowId}/run`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to trigger workflow ${workflowId}: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (e) {
      console.error(`n8nClient.triggerWorkflow(${workflowId}) error:`, e);
      throw e;
    }
  },

  async getHealth() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/healthz`);
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};
