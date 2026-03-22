import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { CheckoutButton } from '@/components/checkout-button'
import { Check, Shirt, Sparkles, Crown, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose your Fit Check plan. Free, Pro, or Stylist one-time.',
}

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold">
            <Zap className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
            Start free. Upgrade <span className="text-gold">when ready.</span>
          </h1>
          <p className="mx-auto max-w-xl text-muted">
            Rate fits, post outfits, and get community feedback — all free.
            Upgrade for unlimited posting, wardrobe tools, and AI-powered style analysis.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Free */}
          <div className="relative flex flex-col rounded-2xl border border-border bg-surface p-8">
            <div className="mb-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Shirt className="h-5 w-5 text-gold" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Free</h2>
              <p className="mt-1 text-sm text-muted">Start rating and getting rated today.</p>
            </div>
            <div className="mb-6">
              <div className="text-4xl font-black text-foreground">$0</div>
              <div className="text-sm text-muted">forever</div>
            </div>
            <ul className="mb-8 flex flex-col gap-3">
              {[
                '1 outfit post per day',
                'Unlimited browse + rating',
                'Fit or Miss swipe mode',
                'Community challenges',
                'Basic profile page',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-auto flex min-h-[48px] items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-gold bg-gold/5 p-8">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-background">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <Crown className="h-5 w-5 text-gold" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Pro</h2>
              <p className="mt-1 text-sm text-muted">Unlimited posting, wardrobe tools, no ads.</p>
            </div>
            <div className="mb-6">
              <div className="text-4xl font-black text-foreground">$2.99</div>
              <div className="text-sm text-muted">per month</div>
            </div>
            <ul className="mb-8 flex flex-col gap-3">
              {[
                'Unlimited outfit posts',
                'Full wardrobe tracker',
                'Style analytics dashboard',
                'No ads',
                'Priority placement in feed',
                'Early access to features',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton plan="pro" label="Go Pro — $2.99/mo" highlighted />
          </div>

          {/* Stylist */}
          <div className="relative flex flex-col rounded-2xl border border-border bg-surface p-8">
            <div className="mb-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Stylist</h2>
              <p className="mt-1 text-sm text-muted">
                AI-powered style analysis. Know your aesthetic forever.
              </p>
            </div>
            <div className="mb-6">
              <div className="text-4xl font-black text-foreground">$4.99</div>
              <div className="text-sm text-muted">one time</div>
            </div>
            <ul className="mb-8 flex flex-col gap-3">
              {[
                'AI style profile generation',
                'Personal aesthetic label',
                'Color palette analysis',
                'Signature pieces report',
                'Personalized recommendations',
                'Unlock once, use forever',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton plan="stylist" label="Get Stylist — $4.99" />
          </div>
        </div>

        {/* FAQ row */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel Pro anytime — your access continues until the end of the billing period.',
            },
            {
              q: 'Is Stylist really one-time?',
              a: 'Yes. Pay once and your AI style profile is yours forever, no subscription needed.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay supported.',
            },
          ].map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{item.q}</h3>
              <p className="text-sm text-muted">{item.a}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Questions?{' '}
          <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
            hello@fitcheckapp.com
          </a>
        </p>
      </main>

      <Footer />
    </div>
  )
}
