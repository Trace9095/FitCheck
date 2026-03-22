import { render } from '@react-email/components'
import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/email'
import Welcome1, { subject as subject1 } from '@/lib/emails/welcome-1'

const FROM = process.env['AUTH_FROM_EMAIL'] ?? 'Fit Check <noreply@fitcheck.app>'
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fitcheck.app'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; name?: string }
    const { email, name } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const resend = getResend()
    const unsubscribeUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`

    const html = await render(
      Welcome1({ name: name ?? 'there', appUrl: APP_URL, unsubscribeUrl })
    )

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: subject1,
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      id: data?.id,
      sequence: 'welcome',
      email: 1,
      schedule: [
        { email: 1, subject: subject1, sendAt: 'immediately' },
        { email: 2, subject: 'Your Fit Feed is ready — here\'s how it works', sendAt: 'day 3' },
        { email: 3, subject: 'How Marcus became a style icon on Fit Check', sendAt: 'day 6' },
        { email: 4, subject: 'Pro: AI style scoring + your complete outfit archive', sendAt: 'day 9' },
        { email: 5, subject: 'Two weeks in — has your style score improved?', sendAt: 'day 14' },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
