/**
 * storage.ts — Secure session storage for Expo
 *
 * Uses expo-secure-store (backed by iOS Keychain / Android Keystore).
 * Never use AsyncStorage for tokens — it is not encrypted.
 */

import * as SecureStore from 'expo-secure-store'

const SESSION_KEY = 'fitcheck_session_token'
const EMAIL_KEY = 'fitcheck_user_email'

// ─── Session ──────────────────────────────────────────────────────────────

export async function storeSession(token: string, email: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(SESSION_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
    SecureStore.setItemAsync(EMAIL_KEY, email, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  ])
}

export async function getStoredSession(): Promise<{
  token: string
  email: string
} | null> {
  const [token, email] = await Promise.all([
    SecureStore.getItemAsync(SESSION_KEY),
    SecureStore.getItemAsync(EMAIL_KEY),
  ])

  if (!token || !email) return null
  return { token, email }
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(SESSION_KEY),
    SecureStore.deleteItemAsync(EMAIL_KEY),
  ])
}

// ─── Generic key-value ────────────────────────────────────────────────────

export async function secureSet(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  })
}

export async function secureGet(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key)
}

export async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key)
}
