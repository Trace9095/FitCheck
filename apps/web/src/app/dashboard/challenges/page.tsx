'use client'

import { useEffect, useState, useTransition } from 'react'
import { Trophy, Plus, CheckCircle, Clock, XCircle } from 'lucide-react'

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
  createdAt: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

export default function DashboardChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    theme: '',
    prizeDescription: '',
    startDate: '',
    endDate: '',
  })

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/challenges')
      if (res.ok) {
        const rows = await res.json() as Challenge[]
        // Postgres COUNT aggregates come back as strings at runtime — cast to number
        setChallenges(rows.map((c) => ({ ...c, entryCount: Number(c.entryCount) })))
      }
    } catch {
      // Network error — leave existing list
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setShowForm(false)
          setForm({ title: '', description: '', theme: '', prizeDescription: '', startDate: '', endDate: '' })
          await load()
        } else {
          const data = await res.json() as { error?: string }
          setCreateError(data.error ?? 'Failed to create challenge.')
        }
      } catch {
        setCreateError('Network error. Try again.')
      }
    })
  }

  async function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      await fetch(`/api/admin/challenges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      await load()
    })
  }

  const active = challenges.filter((c) => c.isActive)
  const inactive = challenges.filter((c) => !c.isActive)

  return (
    <div className="flex-1 overflow-auto pt-14 lg:pt-0">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <h1 className="text-lg font-bold text-foreground">Challenges</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex min-h-[36px] items-center gap-2 rounded-lg bg-gold px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Challenge
        </button>
      </header>

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <div className="mb-1 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold" />
              <span className="text-xs text-muted">Active</span>
            </div>
            <div className="text-2xl font-black text-gold">{active.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-1 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted" />
              <span className="text-xs text-muted">Total</span>
            </div>
            <div className="text-2xl font-black text-foreground">{challenges.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-1 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-muted" />
              <span className="text-xs text-muted">Inactive</span>
            </div>
            <div className="text-2xl font-black text-foreground">{inactive.length}</div>
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="rounded-xl border border-gold/30 bg-surface p-5">
            <h2 className="mb-4 font-bold text-foreground">Create New Challenge</h2>
            <form onSubmit={(e) => void handleCreate(e)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Summer Vibes Challenge"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Theme *</label>
                  <input
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    required
                    placeholder="Summer"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Show us your best summer outfit..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Prize</label>
                <input
                  name="prizeDescription"
                  value={form.prizeDescription}
                  onChange={handleChange}
                  placeholder="1 month Pro subscription"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">Start Date *</label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">End Date *</label>
                  <input
                    name="endDate"
                    type="datetime-local"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              {createError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {createError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex min-h-[40px] items-center gap-2 rounded-lg bg-gold px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create Challenge'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex min-h-[40px] items-center rounded-lg border border-border px-5 text-sm text-muted hover:bg-surface-hover"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Challenges list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Trophy className="mb-3 h-10 w-10 text-muted" />
            <p className="font-medium text-foreground">No challenges yet</p>
            <p className="mt-1 text-sm text-muted">Create your first challenge to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const now = new Date()
              const start = new Date(challenge.startDate)
              const end = new Date(challenge.endDate)
              const isUpcoming = now < start
              const isRunning = now >= start && now <= end
              const isExpired = now > end

              return (
                <div
                  key={challenge.id}
                  className={`rounded-xl border p-5 ${challenge.isActive ? 'border-gold/20 bg-surface' : 'border-border bg-surface opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-foreground">{challenge.title}</h3>
                        <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">
                          {challenge.theme}
                        </span>
                        {isRunning && challenge.isActive && (
                          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Live
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="flex items-center gap-1 rounded-full bg-muted/10 px-2 py-0.5 text-xs text-muted">
                            <Clock className="h-3 w-3" />
                            Upcoming
                          </span>
                        )}
                        {isExpired && (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                            Ended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{challenge.description}</p>
                      {challenge.prizeDescription && (
                        <p className="mt-1 text-xs text-gold">Prize: {challenge.prizeDescription}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                        <span>{formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}</span>
                        <span>{challenge.entryCount} entries</span>
                      </div>
                    </div>
                    <button
                      onClick={() => void handleToggle(challenge.id, challenge.isActive)}
                      disabled={isPending}
                      className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        challenge.isActive
                          ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                          : 'border-gold/30 text-gold hover:bg-gold/10'
                      }`}
                    >
                      {challenge.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
