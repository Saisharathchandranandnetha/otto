// Applies db/migrations/*.sql in filename order, tracked in _migrations.
// Plain SQL migrations run identically on docker Postgres and Supabase.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto', { max: 1 });

async function main() {
  await sql`create table if not exists _migrations (
    name text primary key, applied_at timestamptz not null default now()
  )`;

  const dir = join(process.cwd(), 'db', 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const [done] = await sql`select 1 from _migrations where name = ${file}`;
    if (done) { console.log(`= ${file} (already applied)`); continue; }
    const body = readFileSync(join(dir, file), 'utf8');
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into _migrations (name) values (${file})`;
    });
    console.log(`✓ ${file}`);
  }
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
