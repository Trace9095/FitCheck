import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { outfits, users } from '@/db/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { z } from 'zod'

const createSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().max(500).optional(),
  category: z.enum(['Streetwear', 'Business', 'Casual', 'DateNight', 'Festival', 'Gym']),
})

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = 20

  const where = category
    ? eq(outfits.category, category)
    : undefined

  const [items, countResult] = await Promise.all([
    db
      .select({
        id: outfits.id,
        userId: outfits.userId,
        userHandle: users.handle,
        userName: users.name,
        userAvatarUrl: users.avatarUrl,
        imageUrl: outfits.imageUrl,
        caption: outfits.caption,
        category: outfits.category,
        ratingCount: outfits.ratingCount,
        ratingSum: outfits.ratingSum,
        avgRating: outfits.avgRating,
        isChallengeEntry: outfits.isChallengeEntry,
        createdAt: outfits.createdAt,
      })
      .from(outfits)
      .leftJoin(users, eq(outfits.userId, users.id))
      .where(where)
      .orderBy(desc(outfits.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)` })
      .from(outfits)
      .where(where),
  ])

  const total = Number(countResult[0]?.count ?? 0)

  return NextResponse.json({
    data: {
      items,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    },
  })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createSchema.parse(body)

    // Check free tier limit (1 post/day)
    const user = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).then(r => r[0])
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isProUser = false // TODO: check subscriptions table

    const lastPostDate = user.dailyPostDate ? new Date(user.dailyPostDate) : null
    const isSameDay = lastPostDate && lastPostDate >= today

    if (!isProUser) {
      if (isSameDay && user.dailyPostCount >= 1) {
        return NextResponse.json(
          { error: 'Free tier limit: 1 outfit per day. Upgrade to Pro for unlimited posts.' },
          { status: 429 }
        )
      }
    }

    const [outfit] = await db
      .insert(outfits)
      .values({
        userId: session.userId,
        imageUrl: data.imageUrl,
        caption: data.caption,
        category: data.category,
      })
      .returning()

    // Update daily post count
    await db
      .update(users)
      .set({
        dailyPostCount: isSameDay ? user.dailyPostCount + 1 : 1,
        dailyPostDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId))

    return NextResponse.json({ data: outfit }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    console.error('Create outfit error:', error)
    return NextResponse.json({ error: 'Failed to create outfit.' }, { status: 500 })
  }
}
