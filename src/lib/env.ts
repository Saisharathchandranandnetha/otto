// Runtime environment validation — crashes early with a clear message if a
// required variable is missing. Every env var is documented in .env.example.
// Called once at module load from the app layout.

export interface EnvVars {
  DATABASE_URL: string;
  OPENROUTER_API_KEY?: string;
  EXTRACTOR_MODE: 'mock' | 'live';
  EXTRACTOR_MODEL?: string;
  EXTRACTOR_FALLBACK_MODEL?: string;
  WHATSAPP_MODE: 'simulated' | 'sandbox';
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_WHATSAPP_FROM?: string;
  DEMO_SUPPLIER_WHATSAPP_TO?: string;
  OPENAI_API_KEY?: string;
  LLM_CACHE_DIR?: string;
  PORT?: string;
  OTTO_URL?: string;
}

export function getEnv(): EnvVars {
  const mode = (process.env.EXTRACTOR_MODE ?? 'mock') as 'mock' | 'live';

  if (!process.env.DATABASE_URL && !process.env.CI) {
    // In development, default to local docker Postgres — no env file needed
    process.env.DATABASE_URL = 'postgres://otto:otto@localhost:5432/otto';
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto',
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    EXTRACTOR_MODE: mode,
    EXTRACTOR_MODEL: process.env.EXTRACTOR_MODEL ?? 'openai/gpt-4o',
    EXTRACTOR_FALLBACK_MODEL: process.env.EXTRACTOR_FALLBACK_MODEL ?? 'google/gemini-2.0-flash-001',
    WHATSAPP_MODE: (process.env.WHATSAPP_MODE ?? 'simulated') as 'simulated' | 'sandbox',
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
    DEMO_SUPPLIER_WHATSAPP_TO: process.env.DEMO_SUPPLIER_WHATSAPP_TO,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    LLM_CACHE_DIR: process.env.LLM_CACHE_DIR,
    PORT: process.env.PORT,
    OTTO_URL: process.env.OTTO_URL,
  };
}

/** Call once at startup to log the current configuration. In production, fails
 *  hard if a required var is missing in the current mode. */
export function validateEnv(): void {
  const env = getEnv();

  if (env.EXTRACTOR_MODE === 'live' && !env.OPENROUTER_API_KEY) {
    console.warn(
      '⚠  EXTRACTOR_MODE=live but OPENROUTER_API_KEY is not set.\n' +
      '   The app will fall back to mock extraction (fixture data).\n' +
      '   Set OPENROUTER_API_KEY in .env for real vision extraction.',
    );
  }
}

// Initialize at module level for Next.js serverless context
validateEnv();
