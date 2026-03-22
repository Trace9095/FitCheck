import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicToken, createSessionCookie } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/verify?error=missing_token', request.url))
  }

  const verified = await verifyMagicToken(token)

  if (!verified) {
    return NextResponse.redirect(new URL('/verify?error=invalid_token', request.url))
  }

  // Upsert user in database
  let user = await db
    .select()
    .from(users)
    .where(eq(users.email, verified.email))
    .limit(1)
    .then((rows) => rows[0])

  if (!user) {
    // Create new user — generate handle from email prefix
    const emailPrefix = verified.email.split('@')[0] ?? 'user'
    const handle = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 9999)

    const [newUser] = await db
      .insert(users)
      .values({
        email: verified.email,
        handle,
      })
      .returning()
    user = newUser!
  }

  const response = NextResponse.redirect(new URL('/feed', request.url))
  await createSessionCookie(response, { email: user.email, userId: user.id })
  return response
}
