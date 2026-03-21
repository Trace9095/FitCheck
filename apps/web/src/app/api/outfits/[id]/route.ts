import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { outfits, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [outfit] = await db
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
    .where(eq(outfits.id, id))
    .limit(1)

  if (!outfit) {
    return NextResponse.json({ error: 'Outfit not found' }, { status: 404 })
  }

  return NextResponse.json({ data: outfit })
}
