import type { NextConfig } from 'next'
import { headers } from 'next/headers'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'interest-cohort=(), camera=(self), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: https://*.public.blob.vercel-storage.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://vitals.vercel-insights.com https://*.public.blob.vercel-storage.com",
      "frame-src 'self' https://js.stripe.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

async function getHeaders() {
  const headersList = await headers()
  void headersList
  return [{ source: '/(.*)', headers: securityHeaders }]
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['@fitcheck/shared'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  headers: getHeaders,
}

export default nextConfig
