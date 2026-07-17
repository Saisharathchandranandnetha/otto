import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto');

async function run() {
  const file = path.join(process.cwd(), 'migrations', '017_v2_action_extensions.sql');
  const content = fs.readFileSync(file, 'utf8');
  await sql.unsafe(content);
  console.log('017 applied');
  await sql.end();
}
run();
