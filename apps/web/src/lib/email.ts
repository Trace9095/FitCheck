/**
 * email.ts — Resend client (lazy-initialized)
 *
 * IMPORTANT: Use getResend() inside handlers/server functions only.
 * Do NOT call `new Resend()` at module scope — it fails during SSG.
 *
 * CEO pattern: lazy init to avoid build-time crashes.
 */

import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env['RESEND_API_KEY']
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

// ─── Email helpers ────────────────────────────────────────────────────────

const FROM_EMAIL = process.env['AUTH_FROM_EMAIL'] ?? 'noreply@yourdomain.com'

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  from = FROM_EMAIL,
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}): Promise<{ id?: string; error?: string }> {
  const resend = getResend()
  const { data, error } = await resend.emails.send({ from, to, subject, html })
  if (error) return { error: error.message }
  return { id: data?.id }
}
