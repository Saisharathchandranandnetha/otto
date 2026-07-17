import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto');

async function run() {
  const file = path.join(process.cwd(), 'packages', 'database', 'migrations', '016_v2_trust_engine.sql');
  const content = fs.readFileSync(file, 'utf8');
  await sql.unsafe(content);
  console.log('016 applied');
  await sql.end();
}
run();
