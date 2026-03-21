'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Send, ArrowRight } from 'lucide-react'

interface Suggestion {
  outfit: string
  category: string
  tip: string
}

const CATEGORY_LABELS: Record<string, string> = { DateNight: 'Date Night' }

const EXAMPLE_OCCASIONS = [
  'First date at a rooftop bar',
  'Job interview at a startup',
  'Summer music festival',
  'Beach BBQ with friends',
  'Night out in the city',
  'Casual Monday at the office',
]

export default function AskPage() {
  const [occasion, setOccasion] = useState('')
  const [preferences, setPreferences] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!occasion.trim()) return
    setLoading(true)
    setError('')
    setSuggestions(null)

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occasion, preferences: preferences || undefined }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Failed to get suggestions.')
      setLoading(false)
      return
    }

    setSuggestions(json.data)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">What should I wear?</h1>
        <p className="text-sm text-muted">Describe the occasion. Get 3 AI outfit suggestions instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">The occasion</label>
          <textarea
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. First date at a rooftop bar in NYC, it's warm outside..."
            rows={3}
            maxLength={300}
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Style preferences <span className="text-muted">(optional)</span>
          </label>
          <input
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. I prefer streetwear, no suits..."
            maxLength={300}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-gold"
          />
        </div>

        {/* Quick examples */}
        <div>
          <p className="mb-2 text-xs text-muted">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_OCCASIONS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setOccasion(ex)}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted hover:border-gold hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading || !occasion.trim()}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Thinking...</>
          ) : (
            <><Sparkles className="h-5 w-5" /> Get Outfit Suggestions</>
          )}
        </button>
      </form>

      {/* Results */}
      {suggestions && (
        <div className="mt-8 flex flex-col gap-4">
          <h2 className="font-bold text-foreground">3 outfit ideas for you:</h2>
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                  {i + 1}
                </div>
                <span className="rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 text-xs text-gold">
                  {CATEGORY_LABELS[s.category] ?? s.category}
                </span>
              </div>
              <p className="mt-2 font-medium text-foreground">{s.outfit}</p>
              <p className="mt-2 text-sm text-muted italic">{s.tip}</p>
            </div>
          ))}

          <button
            onClick={() => setSuggestions(null)}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border text-sm text-muted hover:text-foreground"
          >
            Ask again
          </button>
        </div>
      )}
    </div>
  )
}
