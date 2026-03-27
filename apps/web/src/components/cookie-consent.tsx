'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { hasConsentChoice, acceptAll, acceptEssentialOnly } from '@/lib/cookie-consent'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!hasConsentChoice()) setShow(true)
  }, [])

  function accept() {
    acceptAll()
    setShow(false)
  }

  function decline() {
    acceptEssentialOnly()
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0D1117] p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-300">
          We use cookies to improve your experience and analyze site traffic.{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded bg-[#D4A853]/20 px-4 py-2 text-sm font-medium text-[#D4A853] transition-colors hover:bg-[#D4A853]/30"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
