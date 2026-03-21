# Fit Check — Project Context

> **Short name:** FC
> **Group:** CLIENT-SITES
> **GitHub:** Trace9095/FitCheck
> **Production URL:** https://fitcheckapp.com
> **Vercel Slug:** `fit-check`
> **Vercel Root Dir:** `apps/web` (monorepo)
> **Database:** Neon (`fitcheck`)
> **Session created:** S124 — 2026-03-20

---

## App Overview

Outfit rating and style discovery app.
- Post your OOTD, get anonymous ratings 1-10
- "Fit or Miss" swipe-style rating of others' outfits
- Style categories: Streetwear, Business, Casual, Date Night, Festival, Gym
- Style profile: AI analyzes top-rated fits to define your style
- Wardrobe tracker: photograph your closet, get outfit suggestions
- "What should I wear?" AI: describe occasion, get community suggestions
- Style challenges and weekly themes

## Monetization
- Free: 1 fit post/day, unlimited browse + rate
- Pro ($2.99/mo): unlimited posts, style analytics, wardrobe tracker, no ads
- Stylist ($4.99 one-time): AI style analysis, personalized recommendations

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.1.6 App Router, TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui + Lucide icons |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Resend magic links + jose JWTs (httpOnly cookies) |
| Payments | Stripe LIVE keys (Pro subscription + Stylist one-time) |
| Image Storage | Vercel Blob |
| AI | Anthropic Haiku (customer-facing per CEO directive) |
| Mobile | Expo SDK 55 + Expo Router v5 |
| Deployment | Vercel (Root Dir: apps/web) |
| Monorepo | Turborepo (npm workspaces) |

---

## Build Commands

```bash
cd ~/Documents/APPS/CLIENT-SITES/FitCheck-main
npm run dev:web         # Next.js dev server port 3000
cd apps/mobile && npx expo start   # Expo Go
npm run build           # turbo build
cd apps/web && npx drizzle-kit push   # push schema to Neon
```

---

## Database Tables

- users (id, email, name, handle, avatar_url, bio, stripe_customer_id, is_admin, daily_post_count, daily_post_date)
- magic_link_tokens
- subscriptions (Pro tier — Stripe subscription)
- orders (Stylist tier — one-time payment)
- outfits (id, user_id, image_url, caption, category, rating_count, rating_sum, avg_rating)
- ratings (id, user_id, outfit_id, score 1-10)
- wardrobe_items (id, user_id, image_url, category, tags, notes)
- challenges (id, title, description, theme, prize_description, start_date, end_date, is_active)
- challenge_entries (challenge_id, outfit_id, user_id)
- style_profiles (user_id, aesthetic, color_palette, signature_pieces, recommendations)

---

## CEO Directives (Non-Negotiable)

| Rule | Directive |
|------|-----------|
| Dark mode + gold everywhere | #0D1117 bg, #D4A853 gold — non-negotiable |
| No emojis | Lucide icons only. Never use emoji in UI |
| Mobile-first | Check on phone first. 100dvh, 44px targets |
| Auth = Resend magic links | NOT Clerk. CEO directive S118 |
| Monorepo | Turborepo. CEO directive S124 |
| Stripe = LIVE keys in prod | Never use test keys in production |
| No backdrop-blur on fixed | iOS Safari GPU bug. Solid bg only |
| De-branding | YES — no "Epic AI" visible anywhere |
| AI model | Haiku for customer-facing (style analysis, ask AI) |

---

## Key File Locations

| File | Purpose |
|------|---------|
| `apps/web/src/lib/auth.ts` | Magic link send + JWT verify + session cookie |
| `apps/web/src/lib/db.ts` | Drizzle client |
| `apps/web/src/lib/stripe.ts` | Stripe client (lazy init) |
| `apps/web/src/lib/email.ts` | Resend client (lazy init) |
| `apps/web/src/db/schema.ts` | Database schema |
| `apps/web/next.config.ts` | Security headers |
| `apps/mobile/lib/storage.ts` | SecureStore session management |
| `packages/shared/src/types.ts` | Shared TypeScript types |
| `packages/shared/src/constants.ts` | Brand colors, categories, routes, Stripe price IDs |

---

## Session History

| Session | Date | Work Done |
|---------|------|-----------|
| S124 | 2026-03-20 | Initial build from epic-monorepo-starter template |
