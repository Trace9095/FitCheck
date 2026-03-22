import Image from 'next/image'
import { db } from '@/lib/db'
import { outfits, users } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { Star, Shirt } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Content' }

const CATEGORY_LABELS: Record<string, string> = { DateNight: 'Date Night' }

export default async function DashboardContentPage() {
  const [totalOutfits, categoryBreakdown, topRated, recentOutfits] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(outfits).then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({
        category: outfits.category,
        count: sql<number>`count(*)`,
        avgRating: sql<number>`round(avg(${outfits.avgRating})::numeric, 2)`,
      })
      .from(outfits)
      .groupBy(outfits.category)
      .orderBy(desc(sql`count(*)`)),
    db
      .select({
        id: outfits.id,
        imageUrl: outfits.imageUrl,
        category: outfits.category,
        avgRating: outfits.avgRating,
        ratingCount: outfits.ratingCount,
        caption: outfits.caption,
        userHandle: users.handle,
        createdAt: outfits.createdAt,
      })
      .from(outfits)
      .leftJoin(users, eq(outfits.userId, users.id))
      .where(sql`${outfits.ratingCount} >= 3`)
      .orderBy(desc(outfits.avgRating))
      .limit(10),
    db
      .select({
        id: outfits.id,
        imageUrl: outfits.imageUrl,
        category: outfits.category,
        avgRating: outfits.avgRating,
        ratingCount: outfits.ratingCount,
        caption: outfits.caption,
        userHandle: users.handle,
        createdAt: outfits.createdAt,
      })
      .from(outfits)
      .leftJoin(users, eq(outfits.userId, users.id))
      .orderBy(desc(outfits.createdAt))
      .limit(20),
  ])

  return (
    <div className="flex-1 overflow-auto pt-14 lg:pt-0">
      <header className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-bold text-foreground">Content</h1>
      </header>

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Outfits', value: totalOutfits },
            { label: 'Top Rating', value: topRated[0]?.avgRating.toFixed(1) ?? '—' },
            { label: 'Categories', value: categoryBreakdown.length },
            { label: 'With Ratings', value: topRated.length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-1 text-xs text-muted">{s.label}</p>
              <p className="text-2xl font-black text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-bold text-foreground">By Category</h2>
          <div className="space-y-2">
            {categoryBreakdown.map((cat) => {
              const total = totalOutfits || 1
              const pct = Math.round((Number(cat.count) / total) * 100)
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-foreground">
                    {CATEGORY_LABELS[cat.category] ?? cat.category}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-2 rounded-full bg-gold transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-muted">{Number(cat.count)}</span>
                  <span className="w-12 text-right text-xs text-gold">
                    {Number(cat.avgRating).toFixed(1)} avg
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top rated */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-bold text-foreground">
            Top Rated Fits <span className="text-muted font-normal text-sm">(3+ ratings)</span>
          </h2>
          {topRated.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Shirt className="mb-2 h-8 w-8 text-muted" />
              <p className="text-sm text-muted">No rated outfits yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {topRated.map((outfit) => (
                <a
                  key={outfit.id}
                  href={`/feed/${outfit.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-gold/50"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={outfit.imageUrl}
                      alt={outfit.caption ?? 'Outfit'}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform group-hover:scale-105"
                      quality={80}
                    />
                    <div className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-xs font-bold text-gold">
                        {outfit.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gold">
                      {CATEGORY_LABELS[outfit.category] ?? outfit.category}
                    </p>
                    <p className="text-xs text-muted">@{outfit.userHandle ?? 'user'}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-bold text-foreground">Recent Posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    User
                  </th>
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Category
                  </th>
                  <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    Rating
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Posted
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOutfits.map((o) => (
                  <tr key={o.id} className="border-b border-border/30 hover:bg-surface-hover">
                    <td className="py-2 pr-4 text-sm text-foreground">
                      @{o.userHandle ?? 'user'}
                    </td>
                    <td className="py-2 pr-4 text-sm text-muted">
                      {CATEGORY_LABELS[o.category] ?? o.category}
                    </td>
                    <td className="py-2 text-center">
                      {o.ratingCount > 0 ? (
                        <span className="text-sm font-bold text-gold">
                          {o.avgRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Unrated</span>
                      )}
                    </td>
                    <td className="py-2 pl-4 text-right text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
