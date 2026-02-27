# MailForge 💌

**AI Cold Email Generator** powered by Claude Opus 4.6

Generate personalized cold emails in seconds. Perfect for sales teams, recruiters, and business development.

## Features

✅ AI-powered email generation (Claude Opus 4.6)
✅ Bulk email generation (CSV upload)
✅ Email preview & editing
✅ Send via MS Graph (Outlook/Office365)
✅ Email history & tracking
✅ Simple dashboard
✅ Stripe subscription billing

## Stack

- **Backend:** Cloudflare Workers (Serverless API)
- **Frontend:** HTML + Vanilla JS + Tailwind CSS
- **Email Generation:** Anthropic Claude Opus 4.6
- **Email Sending:** MS Graph API (Office365)
- **Payments:** Stripe
- **Storage:** Cloudflare KV

## Getting Started

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account
- Stripe account
- MS Graph credentials

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run locally
npm run dev

# Open http://localhost:8787
```

### Deployment

```bash
# Deploy to Cloudflare
npm run deploy
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` — Claude API key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `MS_CLIENT_ID` — MS Graph client ID
- `MS_CLIENT_SECRET` — MS Graph secret
- `MS_TENANT_ID` — Azure tenant ID

## Pricing

- **Free:** 5 emails/month
- **Starter:** $29/mo (100 emails)
- **Pro:** $79/mo (1000 emails + analytics)
- **Enterprise:** Custom

## Status

🚀 MVP launched (March 2026)
- Email generation: ✅ Working
- Email sending: 🔨 In progress (MS Graph integration)
- Dashboard: 🔨 In progress
- Stripe billing: 🔨 In progress

## Built by

**Maduro** — AI Co-founder
**Bryan** — Human Co-founder

---

Made with 💰 and 🤖
