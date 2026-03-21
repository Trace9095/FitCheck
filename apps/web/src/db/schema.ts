/**
 * schema.ts — Drizzle ORM schema for Fit Check
 * Run: npm run db:push to push to Neon
 */

import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  uuid,
  real,
} from 'drizzle-orm/pg-core'

// ─── Users ────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  handle: text('handle').unique(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  isAdmin: boolean('is_admin').notNull().default(false),
  dailyPostCount: integer('daily_post_count').notNull().default(0),
  dailyPostDate: timestamp('daily_post_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Magic Link Tokens ────────────────────────────────────────────────────

export const magicLinkTokens = pgTable('magic_link_tokens', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  tokenHash: text('token_hash').notNull().unique(),
  usedAt: timestamp('used_at'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Subscriptions (Pro $2.99/mo) ─────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Orders (Stylist $4.99 one-time) ─────────────────────────────────────

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  stripeSessionId: text('stripe_session_id').notNull().unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Outfits ──────────────────────────────────────────────────────────────

export const outfits = pgTable('outfits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  category: text('category').notNull(),
  ratingCount: integer('rating_count').notNull().default(0),
  ratingSum: integer('rating_sum').notNull().default(0),
  avgRating: real('avg_rating').notNull().default(0),
  isChallengeEntry: boolean('is_challenge_entry').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Ratings ──────────────────────────────────────────────────────────────

export const ratings = pgTable('ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  outfitId: uuid('outfit_id')
    .notNull()
    .references(() => outfits.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Wardrobe Items ───────────────────────────────────────────────────────

export const wardrobeItems = pgTable('wardrobe_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  tags: text('tags'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Challenges ───────────────────────────────────────────────────────────

export const challenges = pgTable('challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  theme: text('theme').notNull(),
  prizeDescription: text('prize_description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Challenge Entries ────────────────────────────────────────────────────

export const challengeEntries = pgTable('challenge_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  challengeId: uuid('challenge_id')
    .notNull()
    .references(() => challenges.id, { onDelete: 'cascade' }),
  outfitId: uuid('outfit_id')
    .notNull()
    .references(() => outfits.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Style Profiles ───────────────────────────────────────────────────────

export const styleProfiles = pgTable('style_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  aesthetic: text('aesthetic').notNull(),
  colorPalette: text('color_palette').notNull(),
  signaturePieces: text('signature_pieces').notNull(),
  recommendations: text('recommendations').notNull(),
  outfitCount: integer('outfit_count').notNull().default(0),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
})

// ─── Type exports ─────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type Order = typeof orders.$inferSelect
export type Outfit = typeof outfits.$inferSelect
export type NewOutfit = typeof outfits.$inferInsert
export type Rating = typeof ratings.$inferSelect
export type WardrobeItem = typeof wardrobeItems.$inferSelect
export type Challenge = typeof challenges.$inferSelect
export type ChallengeEntry = typeof challengeEntries.$inferSelect
export type StyleProfile = typeof styleProfiles.$inferSelect
