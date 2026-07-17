import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

export const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto');
