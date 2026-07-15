import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto');

async function migrate() {
  // Create schemas first
  await sql`CREATE SCHEMA IF NOT EXISTS otto`;
  await sql`CREATE SCHEMA IF NOT EXISTS workflows`;
  await sql`CREATE SCHEMA IF NOT EXISTS ai_engine`;

  // Run all SQL files in migrations/ in filename order
  const dir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(dir)) {
    console.log('No migrations directory found.');
    process.exit(0);
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    console.log(`Running migration: ${f}`);
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    await sql.unsafe(content);
  }
  await sql.end();
  console.log('Migrations complete.');
}

migrate().catch(e => { console.error(e); process.exit(1); });
