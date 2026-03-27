import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ConsentAwareAnalytics } from '@/components/ConsentAwareAnalytics'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const APP_NAME = 'Fit Check'
const APP_DESCRIPTION = 'Post your OOTD, get anonymous ratings 1-10. Rate fits with "Fit or Miss" swipe. Discover your style.'
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fitcheckapp.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Fit Check — Post your OOTD, get anonymous style ratings' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0D1117',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground antialiased`}>
        {children}
        <GoogleAnalytics />
        <ConsentAwareAnalytics />
        <CookieConsent />
      </body>
    </html>
  )
}
