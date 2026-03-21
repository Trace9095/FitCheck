/**
 * auth.ts — Mobile auth helpers
 *
 * The mobile app uses the same magic-link flow as the web:
 *  1. POST /api/auth/login with email
 *  2. User taps link in email → opens app via deep link scheme: epicapp://auth/verify?token=...
 *  3. App extracts token and POSTs to /api/auth/mobile-verify (you'll add this route)
 *  4. Server returns session token → stored in SecureStore
 *
 * For now, this module handles deep link handling and session management.
 */

import * as Linking from 'expo-linking'
import { storeSession, clearSession, getStoredSession } from './storage'
import { apiPost } from './api'

// ─── Deep link handling ───────────────────────────────────────────────────

export function getMagicLinkToken(url: string): string | null {
  try {
    const parsed = Linking.parse(url)
    const token = parsed.queryParams?.['token']
    if (typeof token === 'string') return token
    return null
  } catch {
    return null
  }
}

// ─── Session management ───────────────────────────────────────────────────

export async function signIn(token: string, email: string): Promise<void> {
  await storeSession(token, email)
}

export async function signOut(): Promise<void> {
  await clearSession()
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getStoredSession()
  return session !== null
}

// ─── Send magic link via API ──────────────────────────────────────────────

export async function requestMagicLink(email: string): Promise<void> {
  await apiPost('/api/auth/login', { email })
}
