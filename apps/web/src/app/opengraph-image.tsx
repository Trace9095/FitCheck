import { ImageResponse } from 'next/og'

// Route segment config — MUST be static literals (Gold Standard #6)
export const runtime = 'edge'
export const alt = 'Fit Check — Rate your fit. Find your style.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D1117',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#D4A853',
            letterSpacing: '-2px',
          }}
        >
          Fit Check
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#E6EDF3',
            opacity: 0.8,
          }}
        >
          Rate your fit. Find your style.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 16,
          }}
        >
          {['Streetwear', 'Business', 'Casual', 'Date Night', 'Festival', 'Gym'].map((cat) => (
            <div
              key={cat}
              style={{
                background: '#161B22',
                border: '1px solid #30363D',
                borderRadius: 24,
                padding: '8px 16px',
                color: '#8B949E',
                fontSize: 18,
              }}
            >
              {cat}
            </div>
          ))}
        </div>
        {/* Gold bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: '#D4A853',
          }}
        />
      </div>
    ),
    size,
  )
}
