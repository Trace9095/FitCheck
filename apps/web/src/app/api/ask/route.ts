import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'
import { AI_MODEL } from '@fitcheck/shared'
import { z } from 'zod'

const anthropic = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] })

const schema = z.object({
  occasion: z.string().min(5).max(300),
  preferences: z.string().max(300).optional(),
})

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { occasion, preferences } = schema.parse(await request.json())

    const prompt = `You are a fashion-forward style advisor for Fit Check, a style app.

A user is asking: "What should I wear for ${occasion}?"${preferences ? ` They also mentioned: ${preferences}` : ''}

Give 3 specific outfit suggestions, each as an object with:
- "outfit": brief outfit description (2-3 items)
- "category": one of Streetwear, Business, Casual, DateNight, Festival, Gym
- "tip": one actionable styling tip

Return ONLY a JSON array of 3 outfit objects. Keep each outfit description under 100 characters.`

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content?.type !== 'text') throw new Error('Unexpected response')

    const suggestions = JSON.parse(content.text)
    return NextResponse.json({ data: suggestions })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    console.error('Ask AI error:', error)
    return NextResponse.json({ error: 'Failed to get suggestions.' }, { status: 500 })
  }
}
