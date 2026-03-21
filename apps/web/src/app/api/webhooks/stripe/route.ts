import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { users, subscriptions, orders } from '@/db/schema'
import { eq } from 'drizzle-orm'

// IMPORTANT: Do NOT add JSON body parsing — Stripe requires the raw text body
// for signature verification.
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']
  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.mode === 'payment' && session.customer_email) {
        // One-time payment — insert order record
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, session.customer_email))
          .limit(1)
          .then((r) => r[0])

        if (user) {
          await db.insert(orders).values({
            userId: user.id,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            amount: session.amount_total ?? 0,
            status: 'completed',
          })
        }
      } else if (session.mode === 'subscription') {
        // Subscription checkout — store stripeCustomerId on user, then upsert subscription
        const customerId = typeof session.customer === 'string' ? session.customer : null
        if (!customerId) break

        // Resolve user by metadata.userId first, then fall back to customer_email
        let user: typeof users.$inferSelect | undefined
        const metaUserId = session.metadata?.userId
        if (metaUserId) {
          user = await db
            .select()
            .from(users)
            .where(eq(users.id, metaUserId))
            .limit(1)
            .then((r) => r[0])
        }
        if (!user && session.customer_email) {
          user = await db
            .select()
            .from(users)
            .where(eq(users.email, session.customer_email))
            .limit(1)
            .then((r) => r[0])
        }

        if (!user) break

        // Persist stripeCustomerId on the user row if not already set
        if (!user.stripeCustomerId) {
          await db
            .update(users)
            .set({ stripeCustomerId: customerId, updatedAt: new Date() })
            .where(eq(users.id, user.id))
        }

        // Retrieve full subscription object from Stripe so we have period/price data
        const stripe = getStripe()
        const subId =
          typeof session.subscription === 'string' ? session.subscription : null
        if (!subId) break

        const sub = await stripe.subscriptions.retrieve(subId)
        const priceId = sub.items.data[0]?.price.id ?? ''

        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, sub.id))
          .limit(1)
          .then((r) => r[0])

        const subData = {
          userId: user.id,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          stripeCustomerId: customerId,
          status: sub.status,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          updatedAt: new Date(),
        }

        if (existing) {
          await db
            .update(subscriptions)
            .set(subData)
            .where(eq(subscriptions.stripeSubscriptionId, sub.id))
        } else {
          await db.insert(subscriptions).values(subData)
        }
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const user = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .limit(1)
        .then((r) => r[0])

      if (user) {
        const priceId = sub.items.data[0]?.price.id ?? ''
        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, sub.id))
          .limit(1)
          .then((r) => r[0])

        const subData = {
          userId: user.id,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          stripeCustomerId: customerId,
          status: sub.status,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          updatedAt: new Date(),
        }

        if (existing) {
          await db
            .update(subscriptions)
            .set(subData)
            .where(eq(subscriptions.stripeSubscriptionId, sub.id))
        } else {
          await db.insert(subscriptions).values(subData)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db
        .update(subscriptions)
        .set({ status: 'canceled', updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id))
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = typeof invoice.subscription === 'string' ? invoice.subscription : null
      if (subId) {
        await db
          .update(subscriptions)
          .set({ status: 'active', updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, subId))
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = typeof invoice.subscription === 'string' ? invoice.subscription : null
      if (subId) {
        await db
          .update(subscriptions)
          .set({ status: 'past_due', updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, subId))
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
