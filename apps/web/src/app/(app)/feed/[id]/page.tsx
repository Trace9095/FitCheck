import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowLeft, Star, Calendar, User, Trophy } from 'lucide-react'
import type { Metadata } from 'next'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { outfits, users, ratings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { RatingSection } from './rating-section'

const CATEGORY_LABELS: Record<string, string> = { DateNight: 'Date Night' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const outfit = await db
    .select({ caption: outfits.caption, category: outfits.category })
    .from(outfits)
    .where(eq(outfits.id, id))
    .limit(1)
    .then((r) => r[0])

  if (!outfit) return { title: 'Outfit Not Found' }
  const label = CATEGORY_LABELS[outfit.category] ?? outfit.category
  return {
    title: outfit.caption ? `${outfit.caption} — ${label}` : `${label} Outfit`,
    description: `Rate this ${label.toLowerCase()} outfit on Fit Check.`,
  }
}

function ratingColor(avg: number): string {
  if (avg >= 8) return 'text-gold'
  if (avg >= 6) return 'text-success'
  return 'text-muted'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function OutfitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [outfit] = await db
    .select({
      id: outfits.id,
      userId: outfits.userId,
      userHandle: users.handle,
      userName: users.name,
      userAvatarUrl: users.avatarUrl,
      imageUrl: outfits.imageUrl,
      caption: outfits.caption,
      category: outfits.category,
      ratingCount: outfits.ratingCount,
      ratingSum: outfits.ratingSum,
      avgRating: outfits.avgRating,
      isChallengeEntry: outfits.isChallengeEntry,
      createdAt: outfits.createdAt,
    })
    .from(outfits)
    .leftJoin(users, eq(outfits.userId, users.id))
    .where(eq(outfits.id, id))
    .limit(1)

  if (!outfit) notFound()

  // Get session to check if already rated or is own outfit
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)

  let alreadyRated = false
  let isOwnOutfit = false
  let userRatingScore: number | null = null

  if (session?.userId) {
    isOwnOutfit = outfit.userId === session.userId

    if (!isOwnOutfit) {
      const existingRating = await db
        .select({ score: ratings.score })
        .from(ratings)
        .where(and(eq(ratings.userId, session.userId), eq(ratings.outfitId, id)))
        .limit(1)
        .then((r) => r[0])

      alreadyRated = Boolean(existingRating)
      userRatingScore = existingRating?.score ?? null
    }
  }

  const categoryLabel = CATEGORY_LABELS[outfit.category] ?? outfit.category
  const displayName = outfit.userName ?? outfit.userHandle ?? 'Anonymous'
  const handle = outfit.userHandle ?? 'user'

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back nav */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/feed"
          className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm text-muted transition-colors hover:border-gold hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="text-muted">/</span>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
          {categoryLabel}
        </span>
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={outfit.imageUrl}
            alt={outfit.caption ?? `${categoryLabel} outfit`}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
            quality={90}
            priority
          />

          {/* Challenge badge */}
          {outfit.isChallengeEntry && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/90 px-3 py-1.5 text-xs font-semibold text-gold">
              <Trophy className="h-3.5 w-3.5" />
              Challenge Entry
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-5">
          {/* User row */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={`/profile/${handle}`}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold group-hover:bg-gold/20 transition-colors">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">
                  {displayName}
                </p>
                <p className="text-xs text-muted">@{handle}</p>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(String(outfit.createdAt))}
            </div>
          </div>

          {/* Caption */}
          {outfit.caption && (
            <p className="mb-4 text-sm text-foreground leading-relaxed">{outfit.caption}</p>
          )}

          {/* Rating summary */}
          <div className="mb-5 flex items-center gap-4 rounded-xl border border-border bg-background p-4">
            {outfit.ratingCount > 0 ? (
              <>
                <div className="text-center">
                  <div className={`text-3xl font-black ${ratingColor(outfit.avgRating)}`}>
                    {outfit.avgRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted">out of 10</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const filled = i < Math.round(outfit.avgRating)
                      return (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 transition-colors ${
                            filled ? 'fill-gold text-gold' : 'text-border'
                          }`}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted">
                    {outfit.ratingCount.toLocaleString()} {outfit.ratingCount === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 text-muted">
                <Star className="h-5 w-5" />
                <p className="text-sm">No ratings yet — be the first!</p>
              </div>
            )}
          </div>

          {/* Rating section (interactive) */}
          <RatingSection
            outfitId={id}
            isOwnOutfit={isOwnOutfit}
            isLoggedIn={Boolean(session?.userId)}
            alreadyRated={alreadyRated}
            userRatingScore={userRatingScore}
          />
        </div>
      </div>

      {/* See more in category */}
      <div className="mt-6 text-center">
        <Link
          href={`/feed?category=${outfit.category}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-gold hover:text-foreground"
        >
          More {categoryLabel} fits
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
      </div>
    </div>
  )
}
