import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fit Check',
    short_name: 'Fit Check',
    description: 'Post your OOTD, get anonymous ratings. Rate fits with Fit or Miss swipe.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D1117',
    theme_color: '#D4A853',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
