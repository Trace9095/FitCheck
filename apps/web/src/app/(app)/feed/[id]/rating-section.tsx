'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Check, Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'

interface RatingSectionProps {
  outfitId: string
  isOwnOutfit: boolean
  isLoggedIn: boolean
  alreadyRated: boolean
  userRatingScore: number | null
}

export function RatingSection({
  outfitId,
  isOwnOutfit,
  isLoggedIn,
  alreadyRated,
  userRatingScore,
}: RatingSectionProps) {
  const router = useRouter()
  const [score, setScore] = useState<number>(0)
  const [hover, setHover] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(alreadyRated)
  const [submittedScore, setSubmittedScore] = useState(userRatingScore)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!score) return
    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/outfits/${outfitId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Failed to submit rating.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmittedScore(score)
    setSubmitting(false)
    router.refresh()
  }

  if (isOwnOutfit) {
    return (
      <div className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm text-muted">
        This is your fit — see how others rate it!
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background transition-opacity hover:opacity-90"
      >
        <LogIn className="h-4 w-4" />
        Sign in to Rate This Fit
      </Link>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-4 text-center">
        <div className="flex items-center gap-2 text-success">
          <Check className="h-5 w-5" />
          <span className="font-semibold">You rated this {submittedScore}/10</span>
        </div>
        <p className="text-xs text-muted">Thanks for the honest feedback.</p>
      </div>
    )
  }

  const displayScore = hover || score

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="mb-3 text-center text-sm font-medium text-foreground">
        Rate this fit:{' '}
        <span className={`text-lg font-black transition-colors ${displayScore ? 'text-gold' : 'text-muted'}`}>
          {displayScore ? `${displayScore}/10` : '—'}
        </span>
      </p>

      {/* Star picker */}
      <div
        className="mb-4 flex items-center justify-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const val = i + 1
          const active = val <= (hover || score)
          return (
            <button
              key={val}
              type="button"
              onClick={() => setScore(val)}
              onMouseEnter={() => setHover(val)}
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1"
              aria-label={`Rate ${val} out of 10`}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  active ? 'fill-gold text-gold' : 'fill-transparent text-border hover:text-gold/50'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Score labels */}
      <div className="mb-4 flex justify-between text-xs text-muted px-1">
        <span>Miss</span>
        <span>Alright</span>
        <span>Fire</span>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!score || submitting}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          <><Star className="h-4 w-4" /> Submit Rating</>
        )}
      </button>
    </div>
  )
}
