import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { challenges } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  const activeChallenges = await db
    .select({
      id: challenges.id,
      title: challenges.title,
      description: challenges.description,
      theme: challenges.theme,
      prizeDescription: challenges.prizeDescription,
      startDate: challenges.startDate,
      endDate: challenges.endDate,
      isActive: challenges.isActive,
      entryCount: sql<number>`(SELECT COUNT(*) FROM challenge_entries WHERE challenge_id = ${challenges.id})`,
      createdAt: challenges.createdAt,
    })
    .from(challenges)
    .where(eq(challenges.isActive, true))

  return NextResponse.json({ data: activeChallenges })
}
