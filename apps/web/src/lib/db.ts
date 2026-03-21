/**
 * db.ts — Drizzle ORM client for Neon PostgreSQL
 *
 * Uses @neondatabase/serverless for connection pooling in serverless environments.
 * Import { db } from '@/lib/db' to use the Drizzle client everywhere.
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/db/schema'

const DATABASE_URL = process.env['DATABASE_URL']

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Neon serverless HTTP driver — ideal for Vercel serverless functions
const sql = neon(DATABASE_URL)

export const db = drizzle(sql, { schema })

// Re-export schema for convenience
export { schema }
