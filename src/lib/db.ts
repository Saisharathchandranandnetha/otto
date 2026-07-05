// Single typed SQL client (postgres.js). No ORM — plain SQL everywhere, so the
// docker-Postgres demo laptop and the Supabase backup behave identically.
import postgres from 'postgres';
import { getEnv } from './env';

declare global {
  // eslint-disable-next-line no-var
  var __ottoSql: ReturnType<typeof postgres> | undefined;
}

const env = getEnv();

export const sql =
  globalThis.__ottoSql ??
  postgres(env.DATABASE_URL, {
    max: 10,
    idle_timeout: 30,
    max_lifetime: 60 * 30,
    transform: postgres.camel, // snake_case columns ⇄ camelCase in TS
    onnotice: () => {}, // suppress notice messages
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__ottoSql = sql;
}
