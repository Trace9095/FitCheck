import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { outfits, orders, styleProfiles } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import Anthropic from '@anthropic-ai/sdk'
import { AI_MODEL } from '@fitcheck/shared'

const anthropic = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] })

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check Stylist tier — has paid for one-time Stylist order
  const stylistOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .limit(1)
    .then((r) => r[0])

  if (!stylistOrder || stylistOrder.status !== 'completed') {
    return NextResponse.json(
      { error: 'Style analysis requires the Stylist upgrade ($4.99 one-time).' },
      { status: 403 }
    )
  }

  // Get user's top-rated outfits
  const userOutfits = await db
    .select()
    .from(outfits)
    .where(eq(outfits.userId, session.userId))
    .orderBy(desc(outfits.avgRating))
    .limit(10)

  if (userOutfits.length < 3) {
    return NextResponse.json(
      { error: 'You need at least 3 rated outfits to generate a style profile.' },
      { status: 400 }
    )
  }

  const outfitDescriptions = userOutfits
    .map(
      (o, i) =>
        `Outfit ${i + 1}: Category=${o.category}, Rating=${o.avgRating.toFixed(1)}/10 (${o.ratingCount} votes)${o.caption ? `, Caption: "${o.caption}"` : ''}`
    )
    .join('\n')

  const prompt = `You are a professional fashion stylist analyzing a user's outfit data to define their personal style.

Here are their top-rated outfits:
${outfitDescriptions}

Based on these outfits and their categories/ratings, provide a style analysis in JSON format:
{
  "aesthetic": "2-4 word style label (e.g., 'Clean Minimal Streetwear', 'Smart Casual Professional')",
  "colorPalette": ["color1", "color2", "color3", "color4"],
  "signaturePieces": ["piece1", "piece2", "piece3"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"]
}

Keep it specific, actionable, and fashion-forward. Return ONLY valid JSON.`

  try {
    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content?.type !== 'text') {
      throw new Error('Unexpected AI response')
    }

    const analysis = JSON.parse(content.text) as {
      aesthetic: string
      colorPalette: string[]
      signaturePieces: string[]
      recommendations: string[]
    }

    // Upsert style profile
    const existing = await db
      .select()
      .from(styleProfiles)
      .where(eq(styleProfiles.userId, session.userId))
      .limit(1)
      .then((r) => r[0])

    const profileData = {
      userId: session.userId,
      aesthetic: analysis.aesthetic,
      colorPalette: JSON.stringify(analysis.colorPalette),
      signaturePieces: JSON.stringify(analysis.signaturePieces),
      recommendations: JSON.stringify(analysis.recommendations),
      outfitCount: userOutfits.length,
      generatedAt: new Date(),
    }

    if (existing) {
      await db.update(styleProfiles).set(profileData).where(eq(styleProfiles.userId, session.userId))
    } else {
      await db.insert(styleProfiles).values(profileData)
    }

    return NextResponse.json({
      data: {
        aesthetic: analysis.aesthetic,
        colorPalette: analysis.colorPalette,
        signaturePieces: analysis.signaturePieces,
        recommendations: analysis.recommendations,
        outfitCount: userOutfits.length,
      },
    })
  } catch (error) {
    console.error('Style analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze style. Try again.' }, { status: 500 })
  }
}
