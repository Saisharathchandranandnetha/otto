import PgBoss from 'pg-boss';
import dotenv from 'dotenv';
import { sql } from './db.js';

dotenv.config();

const boss = new PgBoss(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto');

boss.on('error', error => console.error(error));

async function start() {
  await boss.start();
  console.log('pg-boss started');

  // Schedule the decay job to run every night at midnight
  await boss.schedule('trust:decay', '0 0 * * *');

  await boss.work('trust:decay', async (job) => {
    console.log(`[trust:decay] Running job ${job.id}`);
    
    // Decay rule: if last_approval < now() - interval '30 days'
    // → decrement level by 1 (floor 0); reset approval_streak
    const result = await sql`
      UPDATE trust_grants
      SET 
        level = GREATEST(level - 1, 0),
        approval_streak = 0,
        last_decay = now(),
        updated_at = now()
      WHERE
        level > 0 AND 
        (last_approval IS NULL OR last_approval < now() - interval '30 days')
      RETURNING id, org_id, agent_id, action_class, level;
    `;

    console.log(`[trust:decay] Decayed ${result.length} trust grants.`);
    
    // Insert into trust_events for audit
    if (result.length > 0) {
      const events = result.map(row => ({
        org_id: row.org_id,
        agent_id: row.agent_id,
        action_class: row.action_class,
        event_type: 'decayed',
        previous_level: row.level + 1,
        new_level: row.level,
        reason: '30 days without approval',
      }));
      
      await sql`
        INSERT INTO trust_events ${sql(events)}
      `;
    }
  });

  console.log('Worker listening for jobs...');
  
  await boss.work('rag:ingest', async (job) => {
    console.log(`[rag:ingest] Processing job ${job.id}`);
    const { sourceId, content } = job.data as { sourceId: string; content: string };
    
    // 1. Chunking (naive split by paragraph for now)
    const chunks = content.split('\n\n').filter(c => c.trim().length > 0);
    
    // 2. Embedding (stubbed)
    // In production, we'd call OpenAI embeddings or similar
    // const embeddings = await getEmbeddings(chunks);
    
    // Stub: 1536-dimensional array of 0s for now, to satisfy pgvector
    const zeroVector = '[' + Array(1536).fill(0).join(',') + ']';

    // 3. Store in knowledge_chunks
    for (let i = 0; i < chunks.length; i++) {
      await sql`
        INSERT INTO knowledge_chunks (source_id, content, embedding, chunk_index)
        VALUES (${sourceId}, ${chunks[i]}, ${zeroVector}, ${i})
      `;
    }

    // 4. Mark source as synced
    await sql`
      UPDATE knowledge_sources
      SET sync_status = 'synced', last_synced_at = now(), updated_at = now()
      WHERE id = ${sourceId}
    `;

    console.log(`[rag:ingest] Ingested ${chunks.length} chunks for source ${sourceId}`);
  });
}

start().catch(console.error);
