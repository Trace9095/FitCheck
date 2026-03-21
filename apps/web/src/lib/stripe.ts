/**
 * stripe.ts — Stripe client (lazy-initialized)
 *
 * Uses lazy init to avoid errors during SSG/build when env vars are absent.
 * Always call getStripe() inside handlers, never at module scope.
 *
 * CEO directive: Use LIVE keys (sk_live_) in production.
 */

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env['STRIPE_SECRET_KEY']
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// ─── Checkout helpers ─────────────────────────────────────────────────────

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  mode = 'payment',
  metadata = {},
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
  mode?: 'payment' | 'subscription'
  metadata?: Record<string, string>
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()
  return stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe()
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getOrCreateStripeCustomer(email: string): Promise<string> {
  const stripe = getStripe()

  // Check if customer already exists
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0 && existing.data[0]) {
    return existing.data[0].id
  }

  // Create new customer
  const customer = await stripe.customers.create({ email })
  return customer.id
}
