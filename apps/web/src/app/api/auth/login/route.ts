import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLink } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

    await sendMagicLink(email)

    return NextResponse.json({ message: 'Magic link sent. Check your email.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    console.error('Magic link error:', error)
    return NextResponse.json({ error: 'Failed to send magic link.' }, { status: 500 })
  }
}
