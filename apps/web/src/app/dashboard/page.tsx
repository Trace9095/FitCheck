import { db } from '@/lib/db'
import { users, outfits, ratings, subscriptions, challenges, orders } from '@/db/schema'
import { eq, sql, desc, gte } from 'drizzle-orm'
import {
  Users,
  Shirt,
  Star,
  Crown,
  Trophy,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Overview' }

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gold,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  gold?: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${gold ? 'border-gold/30 bg-gold/5' : 'border-border bg-surface'}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${gold ? 'bg-gold/20' : 'bg-surface-hover'}`}>
          <Icon className={`h-4 w-4 ${gold ? 'text-gold' : 'text-muted'}`} />
        </div>
      </div>
      <div className={`text-3xl font-black ${gold ? 'text-gold' : 'text-foreground'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  )
}

export default async function DashboardOverviewPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsersThisWeek,
    totalOutfits,
    outfitsThisWeek,
    totalRatings,
    activeSubscriptions,
    totalRevenue,
    activeChallenges,
    topOutfits,
    recentUsers,
    ratingsThisWeek,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users).then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo))
      .then((r) => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(outfits).then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(outfits)
      .where(gte(outfits.createdAt, sevenDaysAgo))
      .then((r) => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(ratings).then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(orders)
      .where(eq(orders.status, 'completed'))
      .then((r) => Number(r[0]?.total ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(challenges)
      .where(eq(challenges.isActive, true))
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({
        id: outfits.id,
        imageUrl: outfits.imageUrl,
        category: outfits.category,
        avgRating: outfits.avgRating,
        ratingCount: outfits.ratingCount,
        userHandle: users.handle,
      })
      .from(outfits)
      .leftJoin(users, eq(outfits.userId, users.id))
      .where(gte(outfits.createdAt, thirtyDaysAgo))
      .orderBy(desc(outfits.avgRating))
      .limit(5),
    db
      .select({
        email: users.email,
        handle: users.handle,
        createdAt: users.createdAt,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(8),
    db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(gte(ratings.createdAt, sevenDaysAgo))
      .then((r) => Number(r[0]?.count ?? 0)),
  ])

  const mrr = activeSubscriptions * 2.99
  const revenueFormatted = `$${(totalRevenue / 100).toFixed(2)}`
  const mrrFormatted = `$${mrr.toFixed(2)}`

  return (
    <div className="flex-1 overflow-auto pt-14 lg:pt-0">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <h1 className="text-lg font-bold text-foreground">Overview</h1>
        <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          Live
        </span>
      </header>

      <div className="space-y-6 p-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          <StatCard label="Total Users" value={totalUsers} sub={`+${newUsersThisWeek} this week`} icon={Users} />
          <StatCard label="Total Fits" value={totalOutfits} sub={`+${outfitsThisWeek} this week`} icon={Shirt} />
          <StatCard label="Total Ratings" value={totalRatings} sub={`+${ratingsThisWeek} this week`} icon={Star} />
          <StatCard label="Pro Subscribers" value={activeSubscriptions} sub={`MRR ${mrrFormatted}`} icon={Crown} gold />
          <StatCard label="Active Challenges" value={activeChallenges} icon={Trophy} />
          <StatCard label="MRR" value={mrrFormatted} sub="Monthly recurring" icon={TrendingUp} gold />
          <StatCard label="Total Revenue" value={revenueFormatted} sub="One-time orders" icon={DollarSign} />
          <StatCard label="Engagement" value={`${totalRatings > 0 && totalOutfits > 0 ? (totalRatings / totalOutfits).toFixed(1) : '0'}x`} sub="Avg ratings per fit" icon={Activity} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top fits */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 font-bold text-foreground">Top Fits (30 days)</h2>
            {topOutfits.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">No outfits yet.</p>
            ) : (
              <div className="space-y-2">
                {topOutfits.map((outfit, i) => (
                  <div
                    key={outfit.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-hover"
                  >
                    <span className="w-5 text-center text-xs font-bold text-muted">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-foreground">
                        @{outfit.userHandle ?? 'user'} — {outfit.category}
                      </p>
                      <p className="text-xs text-muted">{outfit.ratingCount} ratings</p>
                    </div>
                    <span className="text-sm font-black text-gold">
                      {outfit.avgRating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent users */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-foreground">Recent Users</h2>
              <a href="/dashboard/users" className="text-xs text-gold hover:underline">
                View all
              </a>
            </div>
            {recentUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">No users yet.</p>
            ) : (
              <div className="space-y-1">
                {recentUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-surface-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        @{u.handle ?? 'no-handle'}
                        {u.isAdmin && (
                          <span className="ml-2 rounded-full bg-gold/10 px-1.5 py-0.5 text-xs text-gold">
                            admin
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted">{u.email}</p>
                    </div>
                    <p className="ml-3 shrink-0 text-xs text-muted">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
