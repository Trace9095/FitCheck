/**
 * constants.ts — Shared constants for Fit Check
 */

// ─── Brand ────────────────────────────────────────────────────────────────

export const BRAND = {
  name: 'Fit Check',
  tagline: 'Rate your fit. Find your style.',
  url: 'https://fitcheckapp.com',
  gold: '#D4A853',
  bg: '#0D1117',
  handle: '@fitcheckapp',
} as const

// ─── Outfit Categories ────────────────────────────────────────────────────

export const OUTFIT_CATEGORIES = [
  { value: 'Streetwear', label: 'Streetwear' },
  { value: 'Business', label: 'Business' },
  { value: 'Casual', label: 'Casual' },
  { value: 'DateNight', label: 'Date Night' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Gym', label: 'Gym' },
] as const

export type OutfitCategoryValue = (typeof OUTFIT_CATEGORIES)[number]['value']

// ─── Wardrobe Categories ──────────────────────────────────────────────────

export const WARDROBE_CATEGORIES = [
  { value: 'Tops', label: 'Tops' },
  { value: 'Bottoms', label: 'Bottoms' },
  { value: 'Shoes', label: 'Shoes' },
  { value: 'Outerwear', label: 'Outerwear' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Dresses', label: 'Dresses' },
] as const

// ─── User Tiers ───────────────────────────────────────────────────────────

export const TIER = {
  FREE: 'free',
  PRO: 'pro',
  STYLIST: 'stylist',
} as const

// ─── Stripe Price IDs ─────────────────────────────────────────────────────
// Replace with real Stripe price IDs after creating in dashboard

export const STRIPE_PRICES = {
  PRO_MONTHLY: 'price_1TDZL1PMHtPyRedn0nuCu0S4',
  STYLIST_ONETIME: 'price_fitcheck_stylist',
} as const

// ─── Routes ───────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  VERIFY: '/verify',
  FEED: '/feed',
  POST: '/post',
  RATE: '/rate',
  WARDROBE: '/wardrobe',
  STYLE: '/style',
  CHALLENGES: '/challenges',
  ASK: '/ask',
  ADMIN: '/admin',
  profile: (handle: string) => `/profile/${handle}`,
} as const

// ─── Free Tier Limits ─────────────────────────────────────────────────────

export const FREE_TIER = {
  MAX_DAILY_POSTS: 1,
} as const

// ─── AI Model ─────────────────────────────────────────────────────────────
// Haiku for customer-facing per CEO directive

export const AI_MODEL = 'claude-haiku-4-5-20251001' as const
