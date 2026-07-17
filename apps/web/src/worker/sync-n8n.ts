import { sql } from '../lib/db';

/**
 * Syncs the 'workflows' table from Postgres to the local n8n instance.
 * Local n8n instances usually expose REST API on port 5678.
 */

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || 'default-dev-key';

export async function syncWorkflows() {
  console.log('Starting workflow sync to Flow Nexus (n8n)...');
  
  try {
    const workflows = await sql`SELECT id, name, description, trigger_type, actions FROM workflows WHERE status = 'active'`;
    
    console.log(`Found ${workflows.length} active workflows to sync.`);
    
    for (const wf of workflows) {
      console.log(`Syncing workflow ${wf.id}: ${wf.name}`);
      
      // Transform our DB format into n8n format
      const n8nWorkflow = {
        name: wf.name,
        nodes: [
          {
            parameters: {},
            id: 'trigger-node',
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [250, 300]
          },
          // Map DB actions to n8n nodes here (omitted for brevity)
        ],
        connections: {
          'Webhook': {
            main: [
              [
                // Connections here
              ]
            ]
          }
        },
        active: true,
        settings: {
          executionOrder: 'v1'
        }
      };

      const res = await fetch(`${N8N_API_URL}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': N8N_API_KEY
        },
        body: JSON.stringify(n8nWorkflow)
      });

      if (!res.ok) {
        console.warn(`Failed to sync workflow ${wf.id} to n8n. Status: ${res.status}`);
      } else {
        console.log(`Successfully synced ${wf.id} to Flow Nexus.`);
      }
    }
  } catch (error) {
    console.error('Failed to sync workflows:', error);
  } finally {
    process.exit(0);
  }
}

syncWorkflows();
