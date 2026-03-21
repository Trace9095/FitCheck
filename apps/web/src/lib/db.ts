/**
 * db.ts — Drizzle ORM client for Neon PostgreSQL
 *
 * Uses lazy initialization to avoid errors during SSG/build when
 * DATABASE_URL is absent. The `db` export is a transparent Proxy that
 * instantiates the real Drizzle client on first use (inside a request).
 *
 * CEO directive: same lazy-init pattern as getResend() — never throw at module scope.
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '@/db/schema'

type DB = NeonHttpDatabase<typeof schema>

let _db: DB | undefined

function getDb(): DB {
  if (!_db) {
    const url = process.env['DATABASE_URL']
    if (!url) throw new Error('DATABASE_URL environment variable is not set')
    _db = drizzle(neon(url), { schema })
  }
  return _db
}

// Transparent proxy — all existing `db.select(...)` etc. work without changes.
// Never throws at module evaluation time; only on first actual use.
export const db = new Proxy({} as DB, {
  get(_, prop) {
    return getDb()[prop as keyof DB]
  },
})

// Re-export schema for convenience
export { schema }
