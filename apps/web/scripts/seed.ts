/**
 * Standalone admin seed script.
 * Run with: DATABASE_URL=... npx tsx scripts/seed.ts
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import * as schema from '../src/db/schema'

async function main() {
  const DATABASE_URL = process.env['DATABASE_URL']
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const db = drizzle(neon(DATABASE_URL), { schema })

  const ADMIN_EMAIL = 'CEO@epicai.ai'
  const ADMIN_PASSWORD = 'Trace87223!'

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(schema.users)
      .set({ passwordHash, isAdmin: true, name: 'Trace Hildebrand' })
      .where(eq(schema.users.email, ADMIN_EMAIL))
    console.log('Updated admin user:', ADMIN_EMAIL)
  } else {
    await db.insert(schema.users).values({
      email: ADMIN_EMAIL,
      name: 'Trace Hildebrand',
      passwordHash,
      isAdmin: true,
    })
    console.log('Created admin user:', ADMIN_EMAIL)
  }

  console.log('Admin seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
