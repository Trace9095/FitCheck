import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { challenges } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.email || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json() as { isActive?: boolean }

  const [updated] = await db
    .update(challenges)
    .set({ isActive: body.isActive })
    .where(eq(challenges.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data: updated })
}
