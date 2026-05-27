# BillWallet® Documentation Site

A static website showcasing BillWallet® business documentation for billers and internal Paymentus teams.

## Pages

- **Home** (`/`) — Landing page with hero, problem statement, how it works, security, and document navigation
- **Value Proposition** (`/pages/value-proposition.html`) — External-facing business case for biller executives
- **Sales Deck** (`/pages/sales-deck.html`) — 18-slide presentation structure for all biller verticals
- **Internal Guide** (`/pages/internal-guide.html`) — Architecture, one-time payment vs AutoPay deep-dive, security layers

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
cd billwallet-docs
npx vercel
```

Follow the prompts. The `vercel.json` is pre-configured for static hosting.

### Option 2: Vercel Dashboard (Git Integration)

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Set **Root Directory** to `billwallet-docs`
5. Framework Preset: **Other** (static site)
6. Click **Deploy**

### Option 3: Deploy from Monorepo

If this lives inside a larger repo, set the root directory in Vercel project settings:

- **Root Directory:** `billwallet-docs`
- **Build Command:** (leave empty)
- **Output Directory:** `.`

## Local Development

No build step required. Open `index.html` directly in a browser, or use a local server:

```bash
npx serve .
```

## Tech Stack

- Pure HTML/CSS/JS (no framework, no build step)
- Inter font (Google Fonts)
- Font Awesome 6.5 icons
- Vercel for hosting (zero-config static deployment)

## Structure

```
billwallet-docs/
├── index.html                  # Landing page
├── vercel.json                 # Vercel deployment config
├── css/
│   └── styles.css              # Global styles
├── js/
│   └── main.js                 # Navigation + scroll animations
├── pages/
│   ├── value-proposition.html  # Business value proposition
│   ├── sales-deck.html         # Sales deck (18 slides)
│   └── internal-guide.html     # Internal knowledge guide
└── *.md                        # Source markdown documents
```
