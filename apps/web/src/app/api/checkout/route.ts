import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createCheckoutSession, getOrCreateStripeCustomer } from '@/lib/stripe'
import { z } from 'zod'

const PLAN_PRICE_IDS: Record<string, { priceId: string; mode: 'payment' | 'subscription' }> = {
  pro: {
    priceId: process.env['STRIPE_PRO_PRICE_ID'] ?? '',
    mode: 'subscription',
  },
  stylist: {
    priceId: process.env['STRIPE_STYLIST_PRICE_ID'] ?? '',
    mode: 'payment',
  },
}

const schema = z.object({
  plan: z.enum(['pro', 'stylist']),
})

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { plan } = schema.parse(body)

    const planConfig = PLAN_PRICE_IDS[plan]
    if (!planConfig?.priceId) {
      return NextResponse.json({ error: 'Invalid plan or price not configured.' }, { status: 400 })
    }

    const user = await db
      .select({ id: users.id, email: users.email, stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .then((r) => r[0])

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(user.email)
      await db
        .update(users)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(users.id, user.id))
    }

    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      priceId: planConfig.priceId,
      customerId,
      mode: planConfig.mode,
      successUrl: `${appUrl}/${plan === 'stylist' ? 'style' : 'feed'}?checkout=success`,
      cancelUrl: `${appUrl}/pricing?checkout=canceled`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    return NextResponse.json({ data: { url: checkoutSession.url } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
    }
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
