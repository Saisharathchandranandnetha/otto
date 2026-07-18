// @ts-nocheck
import { tool } from 'ai';
import { z } from 'zod';
import { sql } from '@/lib/db';

/**
 * Searches the Knowledge Base using pgvector.
 * In a real implementation with RRF (Reciprocal Rank Fusion), we would:
 * 1. Generate an embedding for the query.
 * 2. Perform a vector similarity search (dense).
 * 3. Perform a full-text search (sparse).
 * 4. Combine the results using RRF.
 */
export async function searchKnowledgeBase(query: string, orgId: string) {
  // Stubbed embedding for now. Production uses OpenAI/equivalent.
  const zeroVector = '[' + Array(1536).fill(0).join(',') + ']';

  // Using vector cosine similarity (<=>) combined with a filter on orgId
  const results = await sql`
    SELECT
      c.id,
      c.content,
      c.chunk_index,
      s.uri,
      s.source_type,
      1 - (c.embedding <=> ${zeroVector}::vector) as similarity
    FROM knowledge_chunks c
    JOIN knowledge_sources s ON c.source_id = s.id
    JOIN knowledge_collections coll ON s.collection_id = coll.id
    WHERE coll.org_id = ${orgId}
    ORDER BY c.embedding <=> ${zeroVector}::vector
    LIMIT 5;
  `;

  return results.map(row => ({
    content: row.content,
    uri: row.uri,
    source_type: row.source_type,
    similarity: row.similarity,
  }));
}

export const createRagSearchTool = (orgId: string) => tool({
  description: 'Search the organization\'s knowledge base for context.',
  parameters: z.object({
    query: z.string().describe('The search query or question to answer.'),
  }),
  // @ts-ignore
  execute: async (args: any) => {
    const { query } = args;
    try {
      const results = await searchKnowledgeBase(query, orgId);
      if (results.length === 0) {
        return "No relevant information found in the knowledge base.";
      }
      return results.map(r => `Source (${r.source_type}): ${r.uri}\nContent: ${r.content}`).join('\n\n---\n\n');
    } catch (error: any) {
      console.error('RAG Search failed:', error);
      return `Failed to search knowledge base: ${error.message}`;
    }
  },
}) as any;
