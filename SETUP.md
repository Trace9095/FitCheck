# Setup Guide — Epic Monorepo Starter

Step-by-step instructions for using this template on a new project.

---

## 0. Pre-Flight

```bash
# Answer these before writing any code:
# - What is the project short name? (e.g., NAI, CalmChat)
# - What Vercel team slug? (epic-ai-projects)
# - Does it need a database? → Neon + Drizzle (already wired)
# - Does it need payments? → Stripe (already wired — add your price IDs)
# - Does it have an iOS/Android app? → Expo (already wired)
# - Is this a client site? → De-branding rules apply
```

---

## 1. Copy the Template

```bash
# Copy (not symlink) the template to your new project directory
cp -r ~/Documents/APPS/_templates/epic-monorepo-starter \
       ~/Documents/APPS/<GROUP>/<PROJECT_NAME>-main

cd ~/Documents/APPS/<GROUP>/<PROJECT_NAME>-main

# Init git
git init
git branch -M main
```

---

## 2. Rename the Project

Find and replace `epic-monorepo-starter` and `@epic/` throughout:

```bash
# package.json (root)
sed -i '' 's/epic-monorepo-starter/<project-name>/g' package.json

# apps/web/package.json
sed -i '' 's/@epic\/web/@<project>\/web/g' apps/web/package.json

# apps/mobile/package.json
sed -i '' 's/@epic\/mobile/@<project>\/mobile/g' apps/mobile/package.json

# packages/shared/package.json
sed -i '' 's/@epic\/shared/@<project>\/shared/g' packages/shared/package.json
```

Then update `apps/mobile/app.json`:
- `name` → your app name
- `slug` → your-app-slug (lowercase, hyphens)
- `ios.bundleIdentifier` → `com.epicai.yourapp`
- `android.package` → `com.epicai.yourapp`
- `scheme` → your deep link scheme

Update `CLAUDE.md`:
- Fill in all `[PLACEHOLDER]` values at the top

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Neon Database

1. Go to [neon.tech](https://neon.tech) → New Project
2. Name it: `<project-name>` (e.g., `nourish-ai`)
3. Region: `us-east-2` (closest to Vercel default)
4. Copy the **pooled connection string** (not the direct connection)
5. Add to `apps/web/.env.local`:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

---

## 5. Configure Auth

Generate a JWT secret:
```bash
openssl rand -hex 32
```

Add to `apps/web/.env.local`:
```
JWT_SECRET=<your-64-char-hex-secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_FROM_EMAIL=noreply@yourdomain.com
```

Make sure your Resend domain is verified (resend.com → Domains).

---

## 6. Configure Stripe (if payments needed)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create your products + prices
3. Copy the price IDs → update `packages/shared/src/constants.ts`
4. Add to `apps/web/.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxx        # LIVE, not test
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
   STRIPE_WEBHOOK_SECRET=               # Add after Vercel deploy (step 9)
   ```

---

## 7. Push Database Schema

```bash
cd apps/web
cp .env.local.example .env.local   # if not done yet
# fill in DATABASE_URL

npx drizzle-kit push
# Verify in Neon console: tables users, magic_link_tokens, subscriptions, orders
```

---

## 8. Add shadcn/ui Components

```bash
cd apps/web
npx shadcn@latest init            # choose: dark, CSS variables, src/ dir
npx shadcn@latest add button card input label dialog sheet tabs toast badge
```

---

## 9. Create Vercel Project

**Option A: CLI**
```bash
cd ~/Documents/APPS/<GROUP>/<PROJECT_NAME>-main
npx vercel link --yes --scope epic-ai-projects
```

**Option B: Dashboard**
1. Go to vercel.com → EPIC AI PROJECTS team
2. Import Git Repository → Trace9095/<REPO_NAME>
3. Configure:
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build` (auto-detected)
   - **Node.js Version:** 20.x

**Add env vars in Vercel dashboard** (Settings → Environment Variables):
```
DATABASE_URL
RESEND_API_KEY
JWT_SECRET
NEXT_PUBLIC_APP_URL     ← your production domain
AUTH_FROM_EMAIL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ADMIN_EMAIL             = CEO@epicai.ai
```

---

## 10. Push to GitHub and Deploy

```bash
# Create GitHub repo: github.com/new → Trace9095/<PROJECT_NAME>

git add .
git commit -m "$(cat <<'EOF'
feat: initial setup from epic-monorepo-starter

Next.js 16.1.6, Expo SDK 55, Drizzle+Neon, Stripe, Resend magic links.
Dark mode + gold accent. Turborepo monorepo.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
git remote add origin git@github.com:Trace9095/<PROJECT_NAME>.git
git push -u origin main
```

Vercel will auto-deploy on push.

---

## 11. Register Stripe Webhook

After first successful Vercel deploy:

1. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** → add to Vercel env as `STRIPE_WEBHOOK_SECRET`
5. Redeploy (or it picks up on next push)

---

## 12. Set Up Expo Mobile (if applicable)

```bash
cd apps/mobile

# Install Expo CLI + EAS CLI
npm install -g expo-cli eas-cli

# Login to Expo
eas login    # use your Expo account

# Register EAS project
eas project:init    # creates EAS project ID

# Update app.json with the EAS project ID
# extra.eas.projectId = "xxx"

# Build for development (internal testing via Expo Go or dev client)
EAS_NO_VCS=1 eas build --platform ios --profile development

# Add mobile env vars
# Create apps/mobile/.env:
# EXPO_PUBLIC_API_URL=https://yourdomain.com
```

---

## 13. Configure DNS (GoDaddy → Vercel)

1. In Vercel Dashboard → Project → Settings → Domains → Add Domain → `yourdomain.com`
2. Vercel provides DNS records
3. In GoDaddy DNS Manager:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
4. Wait for propagation (usually < 1 hour)
5. Update `NEXT_PUBLIC_APP_URL` in Vercel env → Redeploy

---

## 14. Update CLAUDE.md

Fill in all `[PLACEHOLDER]` values and add to session history:
- Project short name, group, GitHub repo, Vercel slug
- Stripe price IDs
- De-branded: YES/NO

---

## Checklist

- [ ] Template copied + renamed
- [ ] `npm install` succeeded
- [ ] Neon database created + `DATABASE_URL` set
- [ ] `npx drizzle-kit push` ran — tables created
- [ ] shadcn/ui initialized
- [ ] Vercel project created, Root Dir = `apps/web`
- [ ] All env vars added to Vercel
- [ ] First deploy successful
- [ ] Stripe webhook registered + `STRIPE_WEBHOOK_SECRET` set
- [ ] Custom domain configured in Vercel
- [ ] DNS updated in GoDaddy
- [ ] `CLAUDE.md` updated with real values
- [ ] EAS project registered (if mobile)
- [ ] First EAS build submitted
