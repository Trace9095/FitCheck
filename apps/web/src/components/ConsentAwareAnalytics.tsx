'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { isCategoryConsented, hasConsentChoice } from '@/lib/cookie-consent'

export function ConsentAwareAnalytics() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (hasConsentChoice() && isCategoryConsented('analytics')) {
      setAllowed(true)
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setAllowed(detail?.analytics === true)
    }
    window.addEventListener('cookie-consent-updated', handler)
    return () => window.removeEventListener('cookie-consent-updated', handler)
  }, [])

  if (!allowed) return null
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
