import { db } from '@/lib/db'
import { subscriptions, orders, users } from '@/db/schema'
import { eq, sql, desc, gte } from 'drizzle-orm'
import { Crown, DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Revenue' }

const MRR_PER_SUB = 2.99

export default async function DashboardRevenuePage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [activeSubs, recentOrders, subHistory, monthlyOrders] = await Promise.all([
    db
      .select({
        id: subscriptions.id,
        stripeSubscriptionId: subscriptions.stripeSubscriptionId,
        status: subscriptions.status,
        stripePriceId: subscriptions.stripePriceId,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        userEmail: users.email,
        userHandle: users.handle,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(50),
    db
      .select({
        id: orders.id,
        amount: orders.amount,
        status: orders.status,
        createdAt: orders.createdAt,
        userEmail: users.email,
        userHandle: users.handle,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(20),
    db
      .select({ count: sql<number>`count(*)`, status: subscriptions.status })
      .from(subscriptions)
      .groupBy(subscriptions.status),
    db
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo)),
  ])

  const activeCount = activeSubs.filter((s) => s.status === 'active').length
  const cancelingCount = activeSubs.filter((s) => s.cancelAtPeriodEnd).length
  const mrr = activeCount * MRR_PER_SUB
  const totalOrderRevenue = recentOrders.reduce((sum, o) => sum + Number(o.amount), 0)
  const monthlyOrderRevenue = Number(monthlyOrders[0]?.total ?? 0)

  return (
    <div className="flex-1 overflow-auto pt-14 lg:pt-0">
      <header className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-bold text-foreground">Revenue</h1>
      </header>

      <div className="space-y-6 p-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: 'MRR',
              value: `$${mrr.toFixed(2)}`,
              sub: `${activeCount} active subs`,
              gold: true,
              icon: TrendingUp,
            },
            {
              label: 'Active Subs',
              value: activeCount,
              sub: cancelingCount > 0 ? `${cancelingCount} canceling` : 'none canceling',
              gold: true,
              icon: Crown,
            },
            {
              label: 'Order Revenue',
              value: `$${(totalOrderRevenue / 100).toFixed(2)}`,
              sub: 'one-time payments',
              gold: false,
              icon: DollarSign,
            },
            {
              label: 'Orders (30d)',
              value: `$${(monthlyOrderRevenue / 100).toFixed(2)}`,
              sub: 'last 30 days',
              gold: false,
              icon: CreditCard,
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border p-5 ${card.gold ? 'border-gold/30 bg-gold/5' : 'border-border bg-surface'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                  {card.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.gold ? 'bg-gold/20' : 'bg-surface-hover'}`}
                >
                  <card.icon className={`h-4 w-4 ${card.gold ? 'text-gold' : 'text-muted'}`} />
                </div>
              </div>
              <div
                className={`text-3xl font-black ${card.gold ? 'text-gold' : 'text-foreground'}`}
              >
                {card.value}
              </div>
              {card.sub && <p className="mt-1 text-xs text-muted">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* Subscription status breakdown */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-bold text-foreground">Subscription Status</h2>
          <div className="flex flex-wrap gap-3">
            {subHistory.map((s) => (
              <div
                key={s.status}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.status === 'active'
                      ? 'bg-success'
                      : s.status === 'canceled'
                        ? 'bg-destructive'
                        : 'bg-muted'
                  }`}
                />
                <span className="text-sm font-medium capitalize text-foreground">{s.status}</span>
                <span className="text-sm text-muted">{Number(s.count)}</span>
              </div>
            ))}
            {subHistory.length === 0 && (
              <p className="text-sm text-muted">No subscriptions yet.</p>
            )}
          </div>
        </div>

        {/* Active subscriptions table */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-bold text-foreground">Subscriptions</h2>
            <span className="text-xs text-muted">{activeSubs.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  {['User', 'Status', 'Renews', 'Subscribed'].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${h === 'Subscribed' ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSubs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-muted">
                      No subscriptions yet.
                    </td>
                  </tr>
                ) : (
                  activeSubs.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-border/50 transition-colors hover:bg-surface-hover"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          @{sub.userHandle ?? 'user'}
                        </p>
                        <p className="text-xs text-muted">{sub.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            sub.status === 'active'
                              ? 'bg-success/10 text-success border border-success/20'
                              : sub.status === 'canceled'
                                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                : 'bg-muted/10 text-muted border border-border'
                          }`}
                        >
                          {sub.cancelAtPeriodEnd && sub.status === 'active'
                            ? 'Canceling'
                            : sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted">
                        {new Date(sub.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* One-time orders */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-bold text-foreground">Recent Orders</h2>
            <span className="text-xs text-muted">{recentOrders.length} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  {['User', 'Amount', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${h === 'Date' ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-muted">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 transition-colors hover:bg-surface-hover"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          @{order.userHandle ?? 'user'}
                        </p>
                        <p className="text-xs text-muted">{order.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gold">
                        ${(Number(order.amount) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${order.status === 'completed' ? 'text-success' : 'text-muted'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
