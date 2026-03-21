/**
 * auth.ts — Resend magic link authentication for Fit Check
 *
 * Flow:
 *  1. User submits email → POST /api/auth/login → sendMagicLink()
 *  2. Resend delivers email with link → /api/auth/verify?token=...
 *  3. verifyMagicToken() validates JWT → session cookie set → redirect /feed
 *
 * CEO directive S118: Auth = Resend magic links. NOT Clerk.
 */

import { SignJWT, jwtVerify } from 'jose'
import type { NextResponse } from 'next/server'
import { getResend } from './email'

const JWT_SECRET = process.env['JWT_SECRET']
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'
const AUTH_FROM = process.env['AUTH_FROM_EMAIL'] ?? 'noreply@fitcheckapp.com'

const MAGIC_LINK_EXPIRY = '15m'
const SESSION_EXPIRY = '7d'
const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60

function getSecret(): Uint8Array {
  if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(JWT_SECRET)
}

// ─── Magic Link ───────────────────────────────────────────────────────────

export async function sendMagicLink(email: string): Promise<void> {
  const secret = getSecret()

  const token = await new SignJWT({ email, type: 'magic-link' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(MAGIC_LINK_EXPIRY)
    .sign(secret)

  const magicUrl = `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`

  const resend = getResend()
  await resend.emails.send({
    from: AUTH_FROM,
    to: email,
    subject: 'Your Fit Check link',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background: #0D1117; color: #E6EDF3; border-radius: 12px;">
        <div style="font-size: 24px; font-weight: 800; color: #D4A853; margin-bottom: 8px;">Fit Check</div>
        <p style="font-size: 14px; color: #8B949E; margin-bottom: 8px;">Rate your fit. Find your style.</p>
        <div style="border-top: 1px solid #30363D; margin: 20px 0;"></div>
        <h2 style="color: #E6EDF3; font-size: 20px; margin-bottom: 12px;">Your magic link is ready</h2>
        <p style="color: #8B949E; margin-bottom: 24px; font-size: 14px;">
          Click the button below to sign in. This link expires in 15 minutes and can only be used once.
        </p>
        <a href="${magicUrl}"
           style="display: inline-block; background: #D4A853; color: #0D1117; padding: 14px 28px;
                  border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
          Sign in to Fit Check
        </a>
        <p style="color: #8B949E; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function verifyMagicToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)

    if (payload['type'] !== 'magic-link' || typeof payload['email'] !== 'string') {
      return null
    }

    return { email: payload['email'] }
  } catch {
    return null
  }
}

// ─── Session ──────────────────────────────────────────────────────────────

export async function createSessionCookie(
  response: NextResponse,
  payload: { email: string; userId?: string }
): Promise<void> {
  const secret = getSecret()

  const sessionToken = await new SignJWT({ ...payload, type: 'session' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(secret)

  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRY_SECONDS,
  })
}

export async function getSession(
  cookieValue: string | undefined
): Promise<{ email: string; userId?: string } | null> {
  if (!cookieValue) return null

  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(cookieValue, secret)

    if (payload['type'] !== 'session' || typeof payload['email'] !== 'string') {
      return null
    }

    return {
      email: payload['email'],
      userId: typeof payload['userId'] === 'string' ? payload['userId'] : undefined,
    }
  } catch {
    return null
  }
}

// ─── Admin guard ──────────────────────────────────────────────────────────

export function isAdmin(email: string): boolean {
  const adminEmail = process.env['ADMIN_EMAIL'] ?? 'CEO@epicai.ai'
  return email.toLowerCase() === adminEmail.toLowerCase()
}
