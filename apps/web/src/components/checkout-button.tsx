'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  plan: 'pro' | 'stylist'
  label: string
  highlighted?: boolean
}

export function CheckoutButton({ plan, label, highlighted = false }: CheckoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })

    if (res.status === 401) {
      // Not logged in — redirect to login with plan hint
      router.push(`/login?plan=${plan}`)
      return
    }

    const data = await res.json()
    if (data.data?.url) {
      window.location.href = data.data.url
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={loading}
      className={`mt-auto flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 ${
        highlighted
          ? 'bg-gold text-background'
          : 'border border-border bg-background text-foreground hover:border-gold'
      }`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {label}
    </button>
  )
}
