'use client'

import { useEffect, useState } from 'react'
import { Trophy, Calendar, Users, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Challenge {
  id: string
  title: string
  description: string
  theme: string
  prizeDescription: string | null
  startDate: string
  endDate: string
  isActive: boolean
  entryCount: number
}

function daysLeft(endDate: string): number {
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/challenges').then(r => r.json()).then(json => {
      setChallenges(json.data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Style Challenges</h1>
        <p className="text-sm text-muted">Weekly themes. Community competition. Win recognition.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Trophy className="mb-4 h-12 w-12 text-muted" />
          <h2 className="font-bold text-foreground">No active challenges</h2>
          <p className="mt-1 text-sm text-muted">Check back soon for new weekly themes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {challenges.map((challenge) => {
            const left = daysLeft(challenge.endDate)
            return (
              <div
                key={challenge.id}
                className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-gold/40"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                    {challenge.theme}
                  </span>
                  {left <= 3 && left > 0 && (
                    <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs text-destructive">
                      Ending soon
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg font-bold text-foreground">{challenge.title}</h2>
                <p className="mt-1 text-sm text-muted">{challenge.description}</p>

                {challenge.prizeDescription && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    <span className="text-sm text-gold">{challenge.prizeDescription}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {challenge.entryCount} entries
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {left > 0 ? `${left}d left` : 'Ended'}
                    </span>
                  </div>
                  <Link
                    href={`/post?challenge=${challenge.id}`}
                    className="flex min-h-[40px] items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background"
                  >
                    Enter
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
