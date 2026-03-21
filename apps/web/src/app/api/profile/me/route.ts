import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, outfits, styleProfiles, subscriptions } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [user, userOutfits, styleProfile, activeSub] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .then((r) => r[0]),
    db
      .select()
      .from(outfits)
      .where(eq(outfits.userId, session.userId))
      .orderBy(desc(outfits.createdAt))
      .limit(50),
    db
      .select()
      .from(styleProfiles)
      .where(eq(styleProfiles.userId, session.userId))
      .limit(1)
      .then((r) => r[0]),
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.userId))
      .limit(1)
      .then((r) => r[0]),
  ])

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Determine tier from subscription
  let tier: 'free' | 'pro' | 'stylist' = 'free'
  if (activeSub?.status === 'active' || activeSub?.status === 'trialing') {
    tier = 'pro'
  }
  // Check if user has Stylist one-time purchase via orders (handled in style analyze)

  return NextResponse.json({
    data: {
      ...user,
      tier,
      outfits: userOutfits,
      styleProfile: styleProfile ?? null,
    },
  })
}
