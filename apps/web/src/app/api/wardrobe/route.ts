import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { wardrobeItems } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const addSchema = z.object({
  imageUrl: z.string().url(),
  category: z.enum(['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories', 'Dresses']),
  tags: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
})

async function getAuthSession(request: NextRequest) {
  const cookieStore = await cookies()
  return getSession(cookieStore.get('session')?.value)
}

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const items = await db
    .select()
    .from(wardrobeItems)
    .where(eq(wardrobeItems.userId, session.userId))
    .orderBy(desc(wardrobeItems.createdAt))

  return NextResponse.json({ data: items })
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession(request)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = addSchema.parse(body)

    const [item] = await db
      .insert(wardrobeItems)
      .values({ userId: session.userId, ...data })
      .returning()

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to add item.' }, { status: 500 })
  }
}
