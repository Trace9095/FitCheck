import { db } from '@/lib/db'
import { users, outfits, subscriptions } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { Users, Crown, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users' }

export default async function DashboardUsersPage() {
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      handle: users.handle,
      name: users.name,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      outfitCount: sql<number>`count(distinct ${outfits.id})`,
      isPro: sql<boolean>`bool_or(${subscriptions.status} = 'active')`,
    })
    .from(users)
    .leftJoin(outfits, eq(outfits.userId, users.id))
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(100)

  const totalUsers = allUsers.length
  const proUsers = allUsers.filter((u) => u.isPro).length
  const adminUsers = allUsers.filter((u) => u.isAdmin).length

  return (
    <div className="flex-1 overflow-auto pt-14 lg:pt-0">
      <header className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-bold text-foreground">Users</h1>
      </header>

      <div className="space-y-6 p-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted" />
              <span className="text-xs text-muted">Total</span>
            </div>
            <div className="text-2xl font-black text-foreground">{totalUsers}</div>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <div className="mb-1 flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted">Pro</span>
            </div>
            <div className="text-2xl font-black text-gold">{proUsers}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-1 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted" />
              <span className="text-xs text-muted">Admins</span>
            </div>
            <div className="text-2xl font-black text-foreground">{adminUsers}</div>
          </div>
        </div>

        {/* Users table */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Handle
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    Fits
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-muted">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  allUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 transition-colors hover:bg-surface-hover"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                            {(user.name ?? user.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm text-foreground">
                              {user.name ?? '—'}
                            </p>
                            <p className="truncate text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted">
                          {user.handle ? `@${user.handle}` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-foreground">
                          {Number(user.outfitCount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                            <Shield className="h-3 w-3" />
                            Admin
                          </span>
                        ) : user.isPro ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                            <Crown className="h-3 w-3" />
                            Pro
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Free</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs text-muted">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: '2-digit',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {allUsers.length === 100 && (
            <div className="border-t border-border px-4 py-3 text-center text-xs text-muted">
              Showing first 100 users
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
