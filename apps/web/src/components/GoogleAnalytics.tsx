'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { getConsentPreferences } from '@/lib/cookie-consent'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''

/**
 * Google Analytics 4 with Consent Mode v2.
 * Always loads but defaults consent to denied until user accepts.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  useEffect(() => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    const prefs = getConsentPreferences()
    if (prefs?.analytics && typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        ad_user_data: prefs.marketing ? 'granted' : 'denied',
        ad_personalization: prefs.marketing ? 'granted' : 'denied',
      })
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
      if (typeof g === 'function') {
        g('consent', 'update', {
          analytics_storage: detail?.analytics ? 'granted' : 'denied',
          ad_storage: detail?.marketing ? 'granted' : 'denied',
          ad_user_data: detail?.marketing ? 'granted' : 'denied',
          ad_personalization: detail?.marketing ? 'granted' : 'denied',
        })
      }
    }
    window.addEventListener('cookie-consent-updated', handler)
    return () => window.removeEventListener('cookie-consent-updated', handler)
  }, [])

  return (
    <>
      <Script id="google-consent-defaults" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            page_title: document.title,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure'
          });
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
        `}
      </Script>
    </>
  )
}
