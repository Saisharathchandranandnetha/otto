import { validateEnv } from '@/lib/env-check';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    validateEnv();
  }
}
