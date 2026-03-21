'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Star, RefreshCw, X, Check, Loader2 } from 'lucide-react'

interface SwipeOutfit {
  id: string
  imageUrl: string
  caption: string | null
  category: string
  userHandle: string | null
  ratingCount: number
  avgRating: number
}

type RatePhase = 'swipe' | 'score'
type Decision = 'fit' | 'miss'

const CATEGORY_LABELS: Record<string, string> = { DateNight: 'Date Night' }

export default function RatePage() {
  const [queue, setQueue] = useState<SwipeOutfit[]>([])
  const [current, setCurrent] = useState<SwipeOutfit | null>(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<RatePhase>('swipe')
  const [decision, setDecision] = useState<Decision | null>(null)
  const [score, setScore] = useState<number>(7)
  const [submitting, setSubmitting] = useState(false)
  const [rated, setRated] = useState(0)
  const [dragX, setDragX] = useState(0)
  const dragStart = useRef<number | null>(null)

  const loadBatch = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/feed/swipe')
    const json = await res.json()
    const items: SwipeOutfit[] = json.data ?? []
    setQueue(items.slice(1))
    setCurrent(items[0] ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadBatch()
  }, [loadBatch])

  function nextOutfit() {
    if (queue.length === 0) {
      void loadBatch()
      return
    }
    setCurrent(queue[0] ?? null)
    setQueue((prev) => prev.slice(1))
    setPhase('swipe')
    setDecision(null)
    setDragX(0)
    setScore(7)
  }

  function handleDecision(d: Decision) {
    setDecision(d)
    setPhase('score')
    setScore(d === 'fit' ? 7 : 3)
  }

  async function submitRating() {
    if (!current) return
    setSubmitting(true)

    const finalScore = decision === 'miss' ? Math.min(score, 5) : Math.max(score, 6)

    await fetch(`/api/outfits/${current.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: finalScore }),
    })

    setRated((r) => r + 1)
    setSubmitting(false)
    nextOutfit()
  }

  function onPointerStart(clientX: number) {
    dragStart.current = clientX
  }

  function onPointerMove(clientX: number) {
    if (dragStart.current === null) return
    setDragX(clientX - dragStart.current)
  }

  function onPointerEnd() {
    if (dragStart.current === null) return
    if (dragX > 80) handleDecision('fit')
    else if (dragX < -80) handleDecision('miss')
    else setDragX(0)
    dragStart.current = null
  }

  const swipeIndicator = dragX > 40 ? 'fit' : dragX < -40 ? 'miss' : null

  if (loading && !current) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-muted">Loading fits...</p>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <Star className="h-12 w-12 text-gold" />
        <h2 className="text-xl font-bold text-foreground">You've rated everything!</h2>
        <p className="text-sm text-muted">
          Check back later for new fits. You rated {rated} fits today.
        </p>
        <button
          onClick={() => void loadBatch()}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border px-6 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-sm items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Fit or Miss</h1>
        <div className="flex items-center gap-1 text-sm text-muted">
          <Star className="h-4 w-4 text-gold" />
          {rated} rated
        </div>
      </div>

      {/* Card stack */}
      <div className="relative h-[65dvh] w-full max-w-sm">
        {/* Background card (peek) */}
        {queue[0] && (
          <div className="absolute inset-0 scale-95 overflow-hidden rounded-2xl border border-border bg-surface opacity-60">
            <Image
              src={queue[0].imageUrl}
              alt=""
              fill
              className="object-cover"
              quality={75}
              aria-hidden
            />
          </div>
        )}

        {/* Active card — swipe phase */}
        {phase === 'swipe' && (
          <div
            className="absolute inset-0 cursor-grab select-none overflow-hidden rounded-2xl border border-border bg-surface active:cursor-grabbing"
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
              transition: dragStart.current !== null ? 'none' : 'transform 0.3s ease',
            }}
            onMouseDown={(e) => onPointerStart(e.clientX)}
            onMouseMove={(e) => onPointerMove(e.clientX)}
            onMouseUp={onPointerEnd}
            onMouseLeave={onPointerEnd}
            onTouchStart={(e) => onPointerStart(e.touches[0]!.clientX)}
            onTouchMove={(e) => onPointerMove(e.touches[0]!.clientX)}
            onTouchEnd={onPointerEnd}
          >
            <Image
              src={current.imageUrl}
              alt={current.caption ?? 'Outfit'}
              fill
              className="pointer-events-none object-cover"
              quality={90}
              priority
            />

            {/* Swipe indicators */}
            {swipeIndicator === 'fit' && (
              <div className="absolute left-4 top-8 rotate-[-12deg] rounded-lg border-4 border-gold px-4 py-2">
                <span className="text-2xl font-black text-gold">FIT</span>
              </div>
            )}
            {swipeIndicator === 'miss' && (
              <div className="absolute right-4 top-8 rotate-[12deg] rounded-lg border-4 border-destructive px-4 py-2">
                <span className="text-2xl font-black text-destructive">MISS</span>
              </div>
            )}

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-xs text-muted">
                  {CATEGORY_LABELS[current.category] ?? current.category}
                </span>
                {current.ratingCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    {current.avgRating.toFixed(1)} ({current.ratingCount})
                  </span>
                )}
              </div>
              {current.caption && (
                <p className="mt-2 text-sm text-foreground">{current.caption}</p>
              )}
              <p className="mt-1 text-xs text-muted">@{current.userHandle ?? 'user'}</p>
            </div>
          </div>
        )}

        {/* Score phase */}
        {phase === 'score' && (
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="relative flex-1 overflow-hidden">
              <Image
                src={current.imageUrl}
                alt=""
                fill
                className="object-cover opacity-50"
                quality={85}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`rounded-xl border-4 px-6 py-3 ${
                    decision === 'fit' ? 'border-gold' : 'border-destructive'
                  }`}
                >
                  <span
                    className={`text-3xl font-black ${
                      decision === 'fit' ? 'text-gold' : 'text-destructive'
                    }`}
                  >
                    {decision === 'fit' ? 'FIT' : 'MISS'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface p-5">
              <p className="mb-3 text-center text-sm font-medium text-foreground">
                Give it a score:{' '}
                <span className="text-lg font-black text-gold">{score}</span>/10
              </p>
              <input
                type="range"
                min={decision === 'fit' ? 6 : 1}
                max={decision === 'fit' ? 10 : 5}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-gold"
                aria-label="Score"
              />
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>{decision === 'miss' ? '1 (Worst)' : '6'}</span>
                <span>{decision === 'fit' ? '10 (Fire)' : '5'}</span>
              </div>
              <button
                onClick={() => void submitRating()}
                disabled={submitting}
                className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Submit Rating
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe action buttons */}
      {phase === 'swipe' && (
        <div className="mt-6 flex items-center gap-8">
          <button
            onClick={() => handleDecision('miss')}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive text-destructive transition-colors hover:bg-destructive hover:text-background"
            aria-label="Miss"
          >
            <X className="h-7 w-7" />
          </button>
          <p className="text-sm text-muted">Swipe or tap</p>
          <button
            onClick={() => handleDecision('fit')}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-background"
            aria-label="Fit"
          >
            <Check className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  )
}
