import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { challengeEntries, outfits } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({ outfitId: z.string().uuid() })

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: challengeId } = await params
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { outfitId } = schema.parse(await request.json())

    // Verify outfit belongs to user
    const outfit = await db.select().from(outfits).where(eq(outfits.id, outfitId)).limit(1).then(r => r[0])
    if (!outfit || outfit.userId !== session.userId) {
      return NextResponse.json({ error: 'Outfit not found or not yours.' }, { status: 403 })
    }

    // Check not already entered
    const existing = await db
      .select()
      .from(challengeEntries)
      .where(and(eq(challengeEntries.challengeId, challengeId), eq(challengeEntries.userId, session.userId)))
      .limit(1)
      .then(r => r[0])

    if (existing) {
      return NextResponse.json({ error: 'Already entered this challenge.' }, { status: 409 })
    }

    const [entry] = await db
      .insert(challengeEntries)
      .values({ challengeId, outfitId, userId: session.userId })
      .returning()

    return NextResponse.json({ data: entry }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to enter challenge.' }, { status: 500 })
  }
}
