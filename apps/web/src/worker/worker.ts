const PgBoss = require('pg-boss');
import { sql } from '../lib/db';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { dbQueryTool } from './tools/dbQueryTool';
import { fetchTool } from './tools/fetchTool';

// The Flow Nexus Runtime - Agentic Orchestration Worker
const queueName = 'agent_tasks';
const dbUrl = process.env.DATABASE_URL || 'postgres://otto:otto@localhost:5432/otto';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

async function startWorker() {
  console.log('Starting Flow Nexus Runtime Worker...');
  
  const boss = new PgBoss(dbUrl);
  
  boss.on('error', (error: any) => console.error('PgBoss error:', error));

  await boss.start();
  
  console.log('pg-boss started and listening to queue:', queueName);

  await boss.work(queueName, async (job: any) => {
    console.log(`Received job ${job.id} for org ${job.data.orgId}`);
    
    const { orgId, workflowId, input, prompt } = job.data as any;
    
    try {
      // 1. Fetch system prompt and tools configuration (mocked for now, in real life we'd query DB)
      const systemPrompt = prompt || `You are an AI assistant orchestrating a workflow for org ${orgId}.`;
      
      // 2. Execute LLM call
      const { text, toolCalls } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: systemPrompt,
        prompt: input || 'Execute the default workflow.',
        tools: {
          dbQuery: dbQueryTool as any,
          fetchUrl: fetchTool as any,
        },
      });
      
      // 3. Update the workflow_runs table
      if (workflowId) {
        await sql`
          UPDATE workflow_runs 
          SET status = 'completed', output = ${text}
          WHERE id = ${workflowId} AND org_id = ${orgId}
        `;
      }
      
      console.log(`Job ${job.id} completed. Result:`, text);
      return { success: true, text, toolCalls };
      
    } catch (err: any) {
      console.error(`Job ${job.id} failed:`, err);
      
      if (workflowId) {
        await sql`
          UPDATE workflow_runs 
          SET status = 'failed', error = ${err.message}
          WHERE id = ${workflowId} AND org_id = ${orgId}
        `;
      }
      
      throw err; // Allow pg-boss to retry if configured
    }
  });
}

startWorker().catch(console.error);
