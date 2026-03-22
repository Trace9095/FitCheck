import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, outfits, ratings, subscriptions, challenges } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Shirt,
  Star,
  Crown,
  Trophy,
  Settings,
  LogOut,
  TrendingUp,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)

  if (!session?.email || !isAdmin(session.email)) {
    redirect('/login')
  }

  const [totalUsers, totalOutfits, totalRatings, activeSubscriptions, activeChallenges, recentUsers] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).then((r) => Number(r[0]?.count ?? 0)),
      db.select({ count: sql<number>`count(*)` }).from(outfits).then((r) => Number(r[0]?.count ?? 0)),
      db.select({ count: sql<number>`count(*)` }).from(ratings).then((r) => Number(r[0]?.count ?? 0)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(subscriptions)
        .where(eq(subscriptions.status, 'active'))
        .then((r) => Number(r[0]?.count ?? 0)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(challenges)
        .where(eq(challenges.isActive, true))
        .then((r) => Number(r[0]?.count ?? 0)),
      db
        .select({ email: users.email, handle: users.handle, createdAt: users.createdAt })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(5),
    ])

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users },
    { label: 'Total Fits', value: totalOutfits, icon: Shirt },
    { label: 'Total Ratings', value: totalRatings, icon: Star },
    { label: 'Pro Subscribers', value: activeSubscriptions, icon: Crown },
    { label: 'Active Challenges', value: activeChallenges, icon: Trophy },
  ]

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-lg font-bold text-gold">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Admin navigation">
          <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" href="/dashboard" active />
          <NavItem icon={<TrendingUp className="h-4 w-4" />} label="Analytics" href="/dashboard" />
          <NavItem icon={<Users className="h-4 w-4" />} label="Users" href="/dashboard/users" />
          <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" href="/dashboard" />
        </nav>
        <div className="border-t border-border p-4">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
          <p className="mt-2 truncate px-3 text-xs text-muted">{session.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        </header>

        <div className="space-y-6 p-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-gold" />
                  <span className="text-xs text-muted">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-foreground">{stat.value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Recent users */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 font-bold text-foreground">Recent Users</h2>
            <div className="flex flex-col gap-2">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted">No users yet.</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-surface-hover"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">@{u.handle ?? 'no-handle'}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                    <p className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────

function NavItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? 'bg-surface-hover text-gold'
          : 'text-muted hover:bg-surface-hover hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
