import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/db/schema'

let seeded = false

export async function seedAdminIfNeeded(): Promise<void> {
  if (seeded) return

  const adminEmail = (process.env.ADMIN_EMAIL ?? 'CEO@epicai.ai').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Trace87223!'
  const adminName = process.env.ADMIN_NAME || 'Trace Hildebrand'

  try {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1)

    if (existing?.passwordHash) {
      seeded = true
      return
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10)

    if (existing) {
      await db
        .update(users)
        .set({ passwordHash, name: adminName, isAdmin: true })
        .where(eq(users.email, adminEmail))
    } else {
      await db.insert(users).values({
        email: adminEmail,
        name: adminName,
        passwordHash,
        isAdmin: true,
      })
    }

    seeded = true
  } catch (err) {
    console.warn('[seed-admin] Could not seed admin:', err)
  }
}
