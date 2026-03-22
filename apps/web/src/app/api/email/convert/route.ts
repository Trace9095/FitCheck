import { render } from '@react-email/components'
import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/email'
import Convert1, { subject as subject1 } from '@/lib/emails/convert-1'
import Convert2, { subject as subject2 } from '@/lib/emails/convert-2'
import Convert3, { subject as subject3 } from '@/lib/emails/convert-3'

const FROM = process.env['AUTH_FROM_EMAIL'] ?? 'Fit Check <noreply@fitcheck.app>'
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fitcheck.app'

const SUBJECTS = [subject1, subject2, subject3] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?: string
      name?: string
      emailNumber?: number
      offerCode?: string
    }
    const { email, name, emailNumber = 1, offerCode } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const num = Number(emailNumber)
    if (num < 1 || num > 3) {
      return NextResponse.json(
        { error: 'emailNumber must be 1, 2, or 3' },
        { status: 400 }
      )
    }

    const resend = getResend()
    const unsubscribeUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    const props = { name: name ?? 'there', appUrl: APP_URL, unsubscribeUrl, offerCode }

    let html: string
    if (num === 1) {
      html = await render(Convert1(props))
    } else if (num === 2) {
      html = await render(Convert2(props))
    } else {
      html = await render(Convert3(props))
    }

    const subject = SUBJECTS[num - 1] ?? subject1

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject,
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
      sequence: 'convert',
      email: num,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
