/**
 * Cookie consent utilities.
 * Categories: essential (always on), analytics, marketing
 */

export type CookieCategory = 'essential' | 'analytics' | 'marketing'

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const CONSENT_KEY = 'fc-cookie-consent'

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: '',
}

export function getConsentPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CookiePreferences
  } catch {
    return null
  }
}

export function setConsentPreferences(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return
  const saved: CookiePreferences = {
    ...prefs,
    essential: true,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(saved))
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: saved }))
}

export function acceptAll(): CookiePreferences {
  const prefs: CookiePreferences = {
    essential: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString(),
  }
  setConsentPreferences(prefs)
  return prefs
}

export function acceptEssentialOnly(): CookiePreferences {
  const prefs: CookiePreferences = {
    ...DEFAULT_PREFERENCES,
    timestamp: new Date().toISOString(),
  }
  setConsentPreferences(prefs)
  return prefs
}

export function hasConsentChoice(): boolean {
  return getConsentPreferences() !== null
}

export function isCategoryConsented(category: CookieCategory): boolean {
  if (category === 'essential') return true
  const prefs = getConsentPreferences()
  if (!prefs) return false
  return prefs[category] ?? false
}
