import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { challenges, challengeEntries } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function GET() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.email || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await db
    .select({
      id: challenges.id,
      title: challenges.title,
      description: challenges.description,
      theme: challenges.theme,
      prizeDescription: challenges.prizeDescription,
      startDate: challenges.startDate,
      endDate: challenges.endDate,
      isActive: challenges.isActive,
      createdAt: challenges.createdAt,
      entryCount: sql<number>`count(distinct ${challengeEntries.id})`,
    })
    .from(challenges)
    .leftJoin(challengeEntries, eq(challengeEntries.challengeId, challenges.id))
    .groupBy(challenges.id)
    .orderBy(desc(challenges.createdAt))

  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.email || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json() as {
    title: string
    description: string
    theme: string
    prizeDescription?: string
    startDate: string
    endDate: string
  }

  if (!body.title || !body.description || !body.theme || !body.startDate || !body.endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const [challenge] = await db
    .insert(challenges)
    .values({
      title: body.title.trim(),
      description: body.description.trim(),
      theme: body.theme.trim(),
      prizeDescription: body.prizeDescription?.trim() || null,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isActive: true,
    })
    .returning()

  return NextResponse.json({ data: challenge }, { status: 201 })
}
