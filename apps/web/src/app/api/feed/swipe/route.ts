import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { outfits, users, ratings } from '@/db/schema'
import { eq, and, not, inArray, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)

  const category = request.nextUrl.searchParams.get('category')

  // Get already-rated outfit IDs for this user
  const ratedIds = session?.userId
    ? await db
        .select({ outfitId: ratings.outfitId })
        .from(ratings)
        .where(eq(ratings.userId, session.userId))
        .then((rows) => rows.map((r) => r.outfitId))
    : []

  // Build where clause
  const conditions = []
  if (session?.userId) {
    conditions.push(not(eq(outfits.userId, session.userId)))
  }
  if (ratedIds.length > 0) {
    conditions.push(not(inArray(outfits.id, ratedIds)))
  }
  if (category) {
    conditions.push(eq(outfits.category, category))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const batch = await db
    .select({
      id: outfits.id,
      userId: outfits.userId,
      userHandle: users.handle,
      userName: users.name,
      imageUrl: outfits.imageUrl,
      caption: outfits.caption,
      category: outfits.category,
      ratingCount: outfits.ratingCount,
      avgRating: outfits.avgRating,
      createdAt: outfits.createdAt,
    })
    .from(outfits)
    .leftJoin(users, eq(outfits.userId, users.id))
    .where(where)
    .orderBy(sql`RANDOM()`)
    .limit(5)

  return NextResponse.json({ data: batch })
}
