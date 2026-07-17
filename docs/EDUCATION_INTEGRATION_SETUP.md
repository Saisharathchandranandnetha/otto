# Education Domain — Integration Setup Guide

## Prerequisites
- Docker Desktop installed and running
- ngrok account (free at ngrok.com) — get your authtoken
- Telegram account — to create a bot via @BotFather
- Dify account — to get API key and app ID

## Step 1: Create your Telegram Bot
1. Open Telegram, search for @BotFather
2. Send `/newbot`
3. Follow prompts — choose name: "Otto Education Assistant"
4. Copy the bot token → paste into `.env` as `TELEGRAM_BOT_TOKEN`

## Step 2: Set up Dify
1. Go to dify.ai → create account → New App → Knowledge Base
2. Upload your education documents 
   (school prospectus, fee structure PDF, syllabus, FAQ)
3. Go to API Access → copy API Key → paste into `.env` as `DIFY_API_KEY`
4. Copy App ID → paste into `.env` as `DIFY_APP_ID`

## Step 3: Set up ngrok
1. Go to ngrok.com → create free account
2. Dashboard → Your Authtoken → copy it
3. Paste into `.env` as `NGROK_AUTHTOKEN`

## Step 4: Add your n8n License
1. Paste your n8n license key into `.env` as `N8N_LICENSE_KEY`

## Step 5: Fill in .env
```bash
cp .env.example .env
# Fill in ALL values marked above
```

## Step 6: Start everything
```bash
pnpm n8n:start
# Wait ~30 seconds for all services to start
```

## Step 7: Run setup script (automates the rest)
```bash
pnpm n8n:setup
# This will:
# ✅ Detect ngrok URL
# ✅ Authenticate with n8n  
# ✅ Import the Education workflow
# ✅ Activate the workflow
# ✅ Register Telegram webhook
# ✅ Update your .env automatically
```

## Step 8: Start Otto
```bash
pnpm dev
```

## Step 9: Test it
1. Open Telegram → find your bot → send any message
2. You should get an AI reply within 3-5 seconds
3. Open `http://localhost:3000/education`
4. Your message should appear in the Live Telegram Feed

## Troubleshooting
- ngrok URL changed? Run `pnpm n8n:setup` again
- n8n not starting? Run `pnpm n8n:logs` to check
- Telegram not responding? Check bot token in `.env`
- Dify not answering? Check API key and upload documents to knowledge base
