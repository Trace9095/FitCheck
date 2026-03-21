import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { outfits, ratings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const rateSchema = z.object({
  score: z.number().int().min(1).max(10),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { score } = rateSchema.parse(body)

    // Check if already rated
    const existing = await db
      .select()
      .from(ratings)
      .where(and(eq(ratings.userId, session.userId), eq(ratings.outfitId, id)))
      .limit(1)
      .then((r) => r[0])

    if (existing) {
      return NextResponse.json({ error: 'You have already rated this outfit.' }, { status: 409 })
    }

    // Check outfit exists and is not own outfit
    const outfit = await db.select().from(outfits).where(eq(outfits.id, id)).limit(1).then(r => r[0])
    if (!outfit) return NextResponse.json({ error: 'Outfit not found' }, { status: 404 })
    if (outfit.userId === session.userId) {
      return NextResponse.json({ error: 'You cannot rate your own outfit.' }, { status: 400 })
    }

    // Insert rating
    const [rating] = await db.insert(ratings).values({
      userId: session.userId,
      outfitId: id,
      score,
    }).returning()

    // Update outfit aggregate
    const newCount = outfit.ratingCount + 1
    const newSum = outfit.ratingSum + score
    const newAvg = newSum / newCount

    await db
      .update(outfits)
      .set({
        ratingCount: newCount,
        ratingSum: newSum,
        avgRating: newAvg,
      })
      .where(eq(outfits.id, id))

    return NextResponse.json({ data: { rating, newAvg, newCount } }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Score must be 1-10.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit rating.' }, { status: 500 })
  }
}
