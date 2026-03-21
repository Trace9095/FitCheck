import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, outfits, styleProfiles } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.handle, handle))
    .limit(1)
    .then((r) => r[0])

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const [userOutfits, styleProfile] = await Promise.all([
    db
      .select()
      .from(outfits)
      .where(eq(outfits.userId, user.id))
      .orderBy(desc(outfits.createdAt))
      .limit(50),
    db
      .select()
      .from(styleProfiles)
      .where(eq(styleProfiles.userId, user.id))
      .limit(1)
      .then((r) => r[0]),
  ])

  return NextResponse.json({ data: { user, outfits: userOutfits, styleProfile: styleProfile ?? null } })
}
