/**
 * types.ts — Shared TypeScript types for Fit Check
 * Import: import type { Outfit, FitCheckUser } from '@fitcheck/shared'
 */

// ─── User ─────────────────────────────────────────────────────────────────

export type UserTier = 'free' | 'pro' | 'stylist'

export interface FitCheckUser {
  id: string
  email: string
  name?: string
  handle?: string
  avatarUrl?: string
  bio?: string
  tier: UserTier
  isAdmin: boolean
  dailyPostCount: number
  createdAt: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export interface Session {
  email: string
  userId?: string
}

export interface MagicLinkRequest {
  email: string
}

export interface MagicLinkResponse {
  message: string
}

// ─── Outfits ──────────────────────────────────────────────────────────────

export type OutfitCategory = 'Streetwear' | 'Business' | 'Casual' | 'DateNight' | 'Festival' | 'Gym'
export type WardrobeCategory = 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear' | 'Accessories' | 'Dresses'

export interface Outfit {
  id: string
  userId: string
  userHandle?: string
  userName?: string
  userAvatarUrl?: string
  imageUrl: string
  caption?: string
  category: OutfitCategory
  ratingCount: number
  ratingSum: number
  avgRating: number
  isChallengeEntry: boolean
  userRating?: number
  createdAt: string
}

export interface Rating {
  id: string
  userId: string
  outfitId: string
  score: number
  createdAt: string
}

// ─── Wardrobe ─────────────────────────────────────────────────────────────

export interface WardrobeItem {
  id: string
  userId: string
  imageUrl: string
  category: WardrobeCategory
  tags?: string
  notes?: string
  createdAt: string
}

// ─── Challenges ───────────────────────────────────────────────────────────

export interface Challenge {
  id: string
  title: string
  description: string
  theme: string
  prizeDescription?: string
  startDate: string
  endDate: string
  isActive: boolean
  entryCount?: number
  createdAt: string
}

// ─── Style Profile ────────────────────────────────────────────────────────

export interface StyleProfile {
  id: string
  userId: string
  aesthetic: string
  colorPalette: string[]
  signaturePieces: string[]
  recommendations: string[]
  outfitCount: number
  generatedAt: string
}

// ─── Stripe ───────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'

export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  stripePriceId: string
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

// ─── API responses ────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
