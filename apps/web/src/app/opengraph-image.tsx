import { ImageResponse } from 'next/og'

// Route segment config — MUST be static literals (Gold Standard #6)
export const runtime = 'edge'
export const alt = 'Fit Check — Get the verdict on your outfit.'
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
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative hanger on right */}
        <div style={{ position: 'absolute', right: '80px', top: '50%', opacity: 0.07 }}>
          <svg width="280" height="280" viewBox="0 0 100 100" fill="none">
            <path d="M 40 26 A 10 10 0 0 1 60 26" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M 60 26 A 6 6 0 0 0 50 16" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round"/>
            <line x1="50" y1="36" x2="16" y2="78" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round"/>
            <line x1="50" y1="36" x2="84" y2="78" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round"/>
            <line x1="16" y1="78" x2="84" y2="78" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Logo mark + brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#161B22',
              border: '1.5px solid #30363D',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <path d="M 40 26 A 10 10 0 0 1 60 26" stroke="#D4A853" strokeWidth="7" strokeLinecap="round"/>
              <path d="M 60 26 A 6 6 0 0 0 50 16" stroke="#D4A853" strokeWidth="7" strokeLinecap="round"/>
              <line x1="50" y1="36" x2="16" y2="78" stroke="#D4A853" strokeWidth="7" strokeLinecap="round"/>
              <line x1="50" y1="36" x2="84" y2="78" stroke="#D4A853" strokeWidth="7" strokeLinecap="round"/>
              <line x1="16" y1="78" x2="84" y2="78" stroke="#D4A853" strokeWidth="7" strokeLinecap="round"/>
              <circle cx="66" cy="60" r="14" fill="#0D1117"/>
              <circle cx="66" cy="60" r="14" stroke="#D4A853" strokeWidth="4"/>
              <polyline points="59,60 63,65 73,54" stroke="#D4A853" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ color: '#D4A853', fontSize: '18px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Fit Check
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: '#E6EDF3',
            fontSize: '68px',
            fontWeight: '800',
            lineHeight: 1.1,
            margin: '0 0 28px 0',
            maxWidth: '720px',
          }}
        >
          Post your fit.
          <br />
          <span style={{ color: '#D4A853' }}>Get the verdict.</span>
        </h1>

        {/* Subheadline */}
        <p style={{ color: '#8B949E', fontSize: '26px', margin: '0 0 48px 0', maxWidth: '600px', lineHeight: 1.5 }}>
          Real ratings from real people — before you walk out the door.
        </p>

        {/* Style tags */}
        <div style={{ display: 'flex', gap: '14px' }}>
          {(['Streetwear', 'Business', 'Casual', 'Date Night', 'Festival'] as string[]).map((cat) => (
            <div
              key={cat}
              style={{
                background: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                padding: '8px 18px',
                color: '#8B949E',
                fontSize: '16px',
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Bottom gold accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#D4A853' }} />
      </div>
    ),
    { ...size }
  )
}
