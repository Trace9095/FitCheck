/**
 * api.ts — HTTP client for the Next.js web API
 *
 * Reads the session token from SecureStore and attaches it as a
 * Bearer token on all authenticated requests.
 *
 * Configure API_BASE_URL in app.json extra or a .env file.
 */

import { getStoredSession } from './storage'

// ─── Configure your API base URL ──────────────────────────────────────────
// In development: your local Next.js server (use LAN IP, not localhost)
// In production: your deployed Vercel URL
const API_BASE_URL =
  process.env['EXPO_PUBLIC_API_URL'] ?? 'http://192.168.1.100:3000'
// ──────────────────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getStoredSession()
  if (!session?.token) return {}
  return { Authorization: `Bearer ${session.token}` }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error')
    throw new Error(`API ${response.status}: ${error}`)
  }

  // Handle empty responses (204 No Content)
  const text = await response.text()
  if (!text) return {} as T

  return JSON.parse(text) as T
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' })
}
