'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Lock, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface StyleResult {
  aesthetic: string
  colorPalette: string[]
  signaturePieces: string[]
  recommendations: string[]
  outfitCount: number
}

export default function StylePage() {
  const [result, setResult] = useState<StyleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locked, setLocked] = useState(false)

  async function analyze() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/style/analyze', { method: 'POST' })
    const json = await res.json()

    if (!res.ok) {
      if (res.status === 403) setLocked(true)
      setError(json.error ?? 'Analysis failed.')
      setLoading(false)
      return
    }

    setResult(json.data)
    setLoading(false)
  }

  if (locked) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gold/10">
              <Lock className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-black text-foreground">Unlock Your Style Profile</h1>
          <p className="mb-2 text-sm text-muted">
            AI-powered style analysis is a one-time $4.99 purchase. Get your personal aesthetic defined forever.
          </p>
          <div className="mb-6 mt-4 rounded-xl border border-border bg-background p-4 text-left">
            {['Personal aesthetic label', 'Color palette analysis', 'Signature pieces report', 'Personalized style recommendations'].map((f) => (
              <div key={f} className="flex items-center gap-2 py-1.5 text-sm text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {f}
              </div>
            ))}
          </div>
          <Link href="/pricing" className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background">
            Get Stylist — $4.99
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">AI Style Profile</h1>
        <p className="text-sm text-muted">Let AI analyze your top-rated fits to define your aesthetic.</p>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/10">
              <Sparkles className="h-10 w-10 text-gold" />
            </div>
          </div>
          <h2 className="mb-2 text-lg font-bold text-foreground">Discover your aesthetic</h2>
          <p className="mb-6 text-sm text-muted">
            Our AI analyzes your top 10 highest-rated outfits to identify patterns and define your unique style.
            You need at least 3 rated outfits to generate a profile.
          </p>

          {error && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            onClick={() => void analyze()}
            disabled={loading}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing your style...</>
            ) : (
              <><Sparkles className="h-5 w-5" /> Analyze My Style</>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Aesthetic */}
          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold">Your Aesthetic</p>
            <h2 className="text-3xl font-black text-foreground">{result.aesthetic}</h2>
            <p className="mt-1 text-sm text-muted">Based on {result.outfitCount} outfits</p>
          </div>

          {/* Color palette */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-bold text-foreground">Color Palette</h3>
            <div className="flex flex-wrap gap-2">
              {result.colorPalette.map((color) => (
                <span key={color} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground">
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Signature pieces */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-bold text-foreground">Signature Pieces</h3>
            <ul className="flex flex-col gap-2">
              {result.signaturePieces.map((piece) => (
                <li key={piece} className="flex items-start gap-2 text-sm text-foreground">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {piece}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-bold text-foreground">Style Recommendations</h3>
            <ul className="flex flex-col gap-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => void analyze()} className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border text-sm text-muted hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
            Regenerate Analysis
          </button>
        </div>
      )}
    </div>
  )
}
