# Epic Monorepo Starter

Production-ready Turborepo monorepo starter for all new Epic AI projects.

**Stack:** Next.js 16.1.6 · Expo SDK 55 · Drizzle + Neon · Stripe · Resend · Tailwind v4 · TypeScript strict

---

## What's Included

### `apps/web` — Next.js 16 App Router
- Dark mode + gold accent theme (`#0D1117` / `#D4A853`) with Geist font
- Resend magic link auth with httpOnly JWT session cookies
- Stripe checkout + webhook handler (6 events: checkout, payment intents, subscriptions)
- Drizzle ORM schema: users, subscriptions, orders
- Security headers (CSP, HSTS, X-Frame-Options) in `next.config.ts`
- Admin dashboard with auth guard
- Mobile-first nav (100dvh, 44px touch targets, no backdrop-blur)
- Per-page OG image with static route segment config
- Vercel Analytics + Speed Insights

### `apps/mobile` — Expo SDK 55
- Expo Router v5 with typed routes
- Dark theme matching web (`#0D1117`)
- Magic link login screen
- Tabs: Home, Profile, Settings
- SecureStore session management (iOS Keychain / Android Keystore)
- EAS build profiles: development, preview, production

### `packages/shared`
- Shared TypeScript types (User, Subscription, ApiResponse, etc.)
- Shared constants (brand colors, routes, Stripe price IDs)

---

## Quick Start

See **SETUP.md** for step-by-step instructions including Neon DB setup, Stripe configuration, and EAS registration.

```bash
# 1. Copy this template
cp -r _templates/epic-monorepo-starter ~/Documents/APPS/<GROUP>/<PROJECT>-main
cd ~/Documents/APPS/<GROUP>/<PROJECT>-main

# 2. Install deps
npm install

# 3. Set up env
cp apps/web/.env.local.example apps/web/.env.local
# Fill in your values

# 4. Push schema to Neon
cd apps/web && npx drizzle-kit push && cd ../..

# 5. Start dev server
npm run dev:web
```

---

## Vercel Deployment

1. Import repo in Vercel dashboard → Team: **epic-ai-projects**
2. Set **Root Directory** to `apps/web`
3. Add all env vars from `apps/web/.env.local.example`
4. Deploy

---

## CEO Standards (Enforced in This Template)

| Standard | Implementation |
|----------|---------------|
| Dark mode + gold | `globals.css` `@theme` — `#0D1117` / `#D4A853` |
| No emojis | Lucide icons throughout |
| Mobile-first | `min-h-[100dvh]`, `min-h-[44px]` touch targets |
| No backdrop-blur on fixed | `bg-background` solid, never `backdrop-blur` |
| Resend magic links | `src/lib/auth.ts` — no Clerk |
| CORS only in security.ts | `src/lib/security.ts` |
| Headers in next.config.ts | Not in middleware or lib/security.ts |
| `quality={90}` on images | `next/image` only, not Lucide icons |
| OG static config | `export const runtime = 'edge'` literal |
| Stripe LIVE keys | `sk_live_` in production |
| Monorepo | Turborepo + npm workspaces |
