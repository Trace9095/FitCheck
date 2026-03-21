/**
 * security.ts — CORS headers only
 *
 * IMPORTANT: Security headers (CSP, HSTS, etc.) live in next.config.ts headers().
 * This file is ONLY for CORS logic used in API route handlers.
 * Never duplicate security headers here.
 */

const ALLOWED_ORIGINS = [
  process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
  // Add additional allowed origins here (e.g., mobile app scheme)
  // 'epicapp://localhost',
]

function isAllowedOrigin(origin: string): boolean {
  // Allow same-origin and localhost in development
  if (process.env['NODE_ENV'] === 'development' && origin.startsWith('http://localhost')) {
    return true
  }
  return ALLOWED_ORIGINS.includes(origin)
}

export function corsHeaders(origin: string): Headers {
  const headers = new Headers()

  if (isAllowedOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  headers.set('Access-Control-Max-Age', '86400')

  return headers
}

// ─── CRON secret guard ────────────────────────────────────────────────────

export function validateCronSecret(req: Request): boolean {
  const secret = req.headers.get('x-cron-secret') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  const expected = process.env['CRON_SECRET']
  if (!expected) return false
  return secret === expected
}

// ─── Rate limiting helpers ────────────────────────────────────────────────
// Simple in-memory rate limiter — replace with Upstash Redis for production

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}
