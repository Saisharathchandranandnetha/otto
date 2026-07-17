import { z } from 'zod';
import { sql } from '../../lib/db';

export const dbQueryTool = {
  description: 'Execute a read-only SQL query against the database to fetch operational data.',
  parameters: z.object({
    query: z.string().describe('The SQL query to execute. Must be a SELECT statement.'),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      if (!query.trim().toUpperCase().startsWith('SELECT')) {
        throw new Error('Only SELECT queries are permitted for safety reasons.');
      }
      
      const results = await sql.unsafe(query);
      return JSON.stringify({ success: true, rows: Array.from(results), count: results.length });
    } catch (error: any) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
};
