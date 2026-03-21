'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setError('Failed to send link. Check your connection.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-12 w-12 text-gold" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-foreground">Check your inbox</h1>
        <p className="text-sm text-muted">
          We sent a magic link to <span className="font-medium text-foreground">{email}</span>.
          Click it to sign in. Link expires in 15 minutes.
        </p>
        <button
          onClick={() => { setStatus('idle'); setEmail('') }}
          className="mt-6 text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-1 text-xl font-bold text-foreground">Sign in or create account</h1>
        <p className="mb-6 text-sm text-muted">No password needed. We will send you a magic link.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted outline-none ring-gold focus:border-gold focus:ring-1"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-gold text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                Continue with Email
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-gold hover:underline">Terms</a> and{' '}
        <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>.
      </p>
    </div>
  )
}
