import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Grid3X3, Sparkles, Award } from 'lucide-react'
import type { Metadata } from 'next'

interface ProfileData {
  user: {
    id: string
    name: string | null
    handle: string | null
    avatarUrl: string | null
    bio: string | null
    createdAt: string
  }
  outfits: Array<{
    id: string
    imageUrl: string
    category: string
    avgRating: number
    ratingCount: number
    caption: string | null
    createdAt: string
  }>
  styleProfile: {
    aesthetic: string
    colorPalette: string
    signaturePieces: string
    recommendations: string
    outfitCount: number
  } | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  return { title: `@${handle} Profile` }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

  const res = await fetch(`${APP_URL}/api/profile/${handle}`, { cache: 'no-store' })
  if (!res.ok) notFound()

  const json = await res.json()
  const { user, outfits, styleProfile } = json.data as ProfileData

  const totalRatings = outfits.reduce((sum, o) => sum + o.ratingCount, 0)
  const topRated = outfits.filter((o) => o.ratingCount > 0).sort((a, b) => b.avgRating - a.avgRating)[0]

  let palette: string[] = []
  let pieces: string[] = []
  if (styleProfile) {
    try { palette = JSON.parse(styleProfile.colorPalette) } catch { palette = [] }
    try { pieces = JSON.parse(styleProfile.signaturePieces) } catch { pieces = [] }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-surface text-3xl font-black text-gold">
          {(user.name ?? user.handle ?? 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-foreground">{user.name ?? `@${user.handle}`}</h1>
          <p className="text-muted">@{user.handle}</p>
          {user.bio && <p className="mt-2 text-sm text-foreground">{user.bio}</p>}

          <div className="mt-3 flex gap-6">
            <div className="text-center">
              <div className="text-xl font-black text-foreground">{outfits.length}</div>
              <div className="text-xs text-muted">Fits</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-foreground">{totalRatings}</div>
              <div className="text-xs text-muted">Ratings</div>
            </div>
            {topRated && (
              <div className="text-center">
                <div className="flex items-center gap-1 text-xl font-black text-gold">
                  <Star className="h-4 w-4 fill-gold" />
                  {topRated.avgRating.toFixed(1)}
                </div>
                <div className="text-xs text-muted">Top score</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Style Profile */}
      {styleProfile && (
        <div className="mb-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-bold text-gold">Style Profile</h2>
          </div>
          <div className="mb-3">
            <div className="text-lg font-black text-foreground">{styleProfile.aesthetic}</div>
            <div className="text-xs text-muted">AI-defined aesthetic</div>
          </div>
          {palette.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium text-muted uppercase tracking-wider">Color Palette</p>
              <div className="flex flex-wrap gap-2">
                {palette.map((color) => (
                  <span key={color} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pieces.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted uppercase tracking-wider">Signature Pieces</p>
              <div className="flex flex-wrap gap-2">
                {pieces.map((piece) => (
                  <span key={piece} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Outfit grid */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Fits ({outfits.length})</h2>
        {outfits.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Grid3X3 className="mb-3 h-10 w-10 text-muted" />
            <p className="text-muted">No fits posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {outfits.map((outfit) => (
              <Link
                key={outfit.id}
                href={`/feed/${outfit.id}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
              >
                <Image
                  src={outfit.imageUrl}
                  alt={outfit.caption ?? 'Outfit'}
                  fill
                  sizes="(max-width: 768px) 33vw, 250px"
                  className="object-cover transition-transform group-hover:scale-105"
                  quality={85}
                />
                {outfit.ratingCount > 0 && (
                  <div className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded-full bg-background/90 px-1.5 py-0.5 text-xs">
                    <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                    <span className="text-gold text-xs font-bold">{outfit.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
