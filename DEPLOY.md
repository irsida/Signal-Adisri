# Signal — Deployment Guide

## What you're deploying
A three-file project:
- `public/index.html` — the Signal UI
- `api/audit.js` — a serverless proxy that calls Anthropic securely
- `vercel.json` — routing config

Your Anthropic API key lives only on Vercel's servers — never exposed in the browser.

---

## What you need before starting
- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account (sign up with GitHub)
- Your Anthropic API key — find it at [console.anthropic.com](https://console.anthropic.com) under API Keys

---

## Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and click **New repository**
2. Name it `signal-audit` (or anything you like)
3. Set it to **Private** (recommended — keeps your code away from public view)
4. Click **Create repository**

---

## Step 2 — Upload your files

In your new repository:

1. Click **Add file → Upload files**
2. Create the following folder structure by uploading files one folder at a time:

```
signal-audit/
├── public/
│   └── index.html
├── api/
│   └── audit.js
└── vercel.json
```

To create folders on GitHub when uploading:
- Click **Add file → Create new file**
- Type `public/index.html` in the filename field — GitHub will auto-create the folder
- Paste the contents of `index.html` and commit
- Repeat for `api/audit.js` and `vercel.json` at the root level

---

## Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Click **Import** next to your `signal-audit` repository
3. Leave all settings as default — Vercel will detect the configuration automatically
4. Click **Deploy**

Your site will be live in about 60 seconds at a URL like `signal-audit.vercel.app`

---

## Step 4 — Add your Anthropic API key

This is the critical step — without it, audits won't run.

1. In Vercel, go to your project dashboard
2. Click **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from console.anthropic.com (starts with `sk-ant-...`)
   - **Environment:** select All (Production, Preview, Development)
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** on your latest deployment

---

## Step 5 — Get a custom domain (optional but recommended)

A custom domain like `trysignal.io` or `signalaudit.co` makes this significantly more impressive in a portfolio context.

1. Buy a domain from [Namecheap](https://namecheap.com) (~$10–15/year)
2. In Vercel, go to **Settings → Domains**
3. Add your domain and follow Vercel's DNS instructions (takes 5–10 minutes to propagate)

---

## Testing your deployment

Once live, paste any social post and run an audit. If you see the loading dots followed by scores — it's working.

If you get an error, check:
- That your API key is saved correctly in Vercel environment variables
- That you redeployed after adding the key
- That your Anthropic account has available credits at [console.anthropic.com](https://console.anthropic.com)

---

## Total cost
- GitHub: free
- Vercel: free (Hobby tier is more than enough)
- Domain: ~$10–15/year (optional)
- Anthropic API: pay-per-use — each audit costs roughly $0.003–0.005 (fraction of a cent)

---

## Portfolio tip
Once deployed, add Signal to your LinkedIn featured section and reference it in applications as a live demo of your AI workflow fluency. Link: `your-domain.vercel.app`
