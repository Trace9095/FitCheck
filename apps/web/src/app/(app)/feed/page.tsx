'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Grid3X3, Plus } from 'lucide-react'

interface OutfitCard {
  id: string
  userHandle: string | null
  userName: string | null
  imageUrl: string
  caption: string | null
  category: string
  ratingCount: number
  avgRating: number
  createdAt: string
}

const CATEGORIES = ['All', 'Streetwear', 'Business', 'Casual', 'DateNight', 'Festival', 'Gym']
const CATEGORY_LABELS: Record<string, string> = { DateNight: 'Date Night' }

function ratingColor(avg: number): string {
  if (avg >= 8) return 'text-gold'
  if (avg >= 6) return 'text-success'
  return 'text-muted'
}

export default function FeedPage() {
  const [category, setCategory] = useState<string>('All')
  const [outfits, setOutfits] = useState<OutfitCard[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const load = useCallback(async (cat: string, pg: number, reset: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(pg) })
      if (cat !== 'All') params.set('category', cat)
      const res = await fetch(`/api/outfits?${params}`)
      const json = await res.json()
      if (reset) {
        setOutfits(json.data?.items ?? [])
      } else {
        setOutfits((prev) => [...prev, ...(json.data?.items ?? [])])
      }
      setHasMore(json.data?.hasMore ?? false)
    } catch {
      // Network error — leave existing outfits, just stop loading
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    void load(category, 1, true)
  }, [category, load])

  function handleCategoryChange(cat: string) {
    setCategory(cat)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Browse Fits</h1>
        <Link
          href="/post"
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background"
        >
          <Plus className="h-4 w-4" />
          Post Fit
        </Link>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex min-h-[36px] shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-gold text-background'
                : 'border border-border bg-surface text-muted hover:border-gold hover:text-foreground'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading && page === 1 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Grid3X3 className="mb-4 h-12 w-12 text-muted" />
          <p className="font-semibold text-foreground">No fits here yet</p>
          <p className="mt-1 text-sm text-muted">Be the first to post in this category.</p>
          <Link
            href="/post"
            className="mt-4 rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-background"
          >
            Post Your Fit
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {outfits.map((outfit) => (
              <Link
                key={outfit.id}
                href={`/feed/${outfit.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-gold/50"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={outfit.imageUrl}
                    alt={outfit.caption ?? 'Outfit'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={90}
                  />
                  {/* Rating badge */}
                  {outfit.ratingCount > 0 && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-bold">
                      <Star className={`h-3 w-3 fill-current ${ratingColor(outfit.avgRating)}`} />
                      <span className={ratingColor(outfit.avgRating)}>{outfit.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs text-muted">
                    {CATEGORY_LABELS[outfit.category] ?? outfit.category}
                  </div>
                </div>
                <div className="p-3">
                  {outfit.caption && (
                    <p className="line-clamp-1 text-xs text-foreground">{outfit.caption}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted">
                    @{outfit.userHandle ?? 'user'} &bull; {outfit.ratingCount} ratings
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  void load(category, next, false)
                }}
                disabled={loading}
                className="min-h-[44px] rounded-lg border border-border px-6 py-2 text-sm font-medium text-muted hover:border-gold hover:text-foreground disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
