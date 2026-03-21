import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, outfits, ratings, subscriptions } from '@/db/schema'
import { eq, sql, gte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.email || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    totalOutfits,
    totalRatings,
    ratingsToday,
    outfitsToday,
    activeSubscriptions,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(outfits).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(ratings).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(ratings).where(gte(ratings.createdAt, today)).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(outfits).where(gte(outfits.createdAt, today)).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.status, 'active')).then(r => Number(r[0]?.count ?? 0)),
  ])

  return NextResponse.json({
    data: {
      totalUsers,
      totalOutfits,
      totalRatings,
      ratingsToday,
      outfitsToday,
      activeSubscriptions,
    },
  })
}
