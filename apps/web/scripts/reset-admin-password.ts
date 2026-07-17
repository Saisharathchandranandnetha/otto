import { sql } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@otto.ai';
  const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD || 'Otto@2026!';
  
  if (!email || !newPassword) {
    console.error('Please provide a password as an argument or set ADMIN_PASSWORD env var.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const result = await sql`
    UPDATE otto_users 
    SET password_hash = ${passwordHash}
    WHERE email = ${email}
    RETURNING id
  `;

  if (result.length > 0) {
    console.log(`Password reset successfully for admin ${email}`);
  } else {
    console.log(`No user found with email ${email}`);
  }
  
  await sql.end();
}

main().catch(console.error);
