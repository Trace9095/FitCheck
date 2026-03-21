import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Check, Shirt, Sparkles, Crown } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose your Fit Check plan. Free, Pro, or Stylist.',
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Start rating and getting rated today.',
    icon: Shirt,
    features: [
      '1 outfit post per day',
      'Unlimited browse + rating',
      'Fit or Miss swipe mode',
      'Community challenges',
      'Basic profile page',
    ],
    cta: 'Get Started Free',
    href: '/login',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$2.99',
    period: 'per month',
    description: 'Unlimited posting, wardrobe tools, no ads.',
    icon: Crown,
    features: [
      'Unlimited outfit posts',
      'Wardrobe tracker',
      'Style analytics dashboard',
      'No ads',
      'Priority in feed',
      'Early access to features',
    ],
    cta: 'Go Pro',
    href: '/login?plan=pro',
    highlighted: true,
  },
  {
    name: 'Stylist',
    price: '$4.99',
    period: 'one time',
    description: 'AI-powered style analysis. Know your aesthetic forever.',
    icon: Sparkles,
    features: [
      'AI style profile generation',
      'Personal aesthetic label',
      'Color palette analysis',
      'Signature pieces report',
      'Personalized recommendations',
      'Unlock once, use forever',
    ],
    cta: 'Get Style Analysis',
    href: '/login?plan=stylist',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
            Simple, honest <span className="text-gold">pricing</span>
          </h1>
          <p className="mx-auto max-w-xl text-muted">
            Start free. Upgrade when you want more. The Stylist tier is a one-time purchase — pay once, get your style profile forever.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-gold bg-gold/5'
                  : 'border-border bg-surface'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-background">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                  <plan.icon className="h-5 w-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-black text-foreground">{plan.price}</div>
                <div className="text-sm text-muted">{plan.period}</div>
              </div>

              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-auto flex min-h-[48px] items-center justify-center rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.highlighted
                    ? 'bg-gold text-background'
                    : 'border border-border bg-background text-foreground hover:border-gold'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Questions? Email us at{' '}
          <a href="mailto:hello@fitcheckapp.com" className="text-gold hover:underline">
            hello@fitcheckapp.com
          </a>
        </p>
      </main>

      <Footer />
    </div>
  )
}
