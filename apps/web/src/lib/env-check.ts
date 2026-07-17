export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'N8N_BASE_URL',
    'N8N_API_KEY', 
    'N8N_WEBHOOK_URL',
    'TELEGRAM_BOT_TOKEN',
    'DIFY_API_KEY',
    'DIFY_API_URL',
    'OTTO_WEBHOOK_SECRET',
    'NGROK_AUTHTOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nCopy .env.example to .env and fill in all values.');
    // For local dev, we won't strictly exit to allow the UI to boot with mock fallbacks if preferred,
    // but the instruction says process.exit(1).
    if (process.env.NODE_ENV === 'production' || process.env.STRICT_ENV === 'true') {
      process.exit(1);
    }
  } else {
    console.log('✅ All environment variables present');
  }
}
