'use client'

import { instagramCalendar, BRAND_CONFIG } from '@/lib/data/instagram-calendar'
import Image from 'next/image'
import { useState } from 'react'

const STATUSES = ['all', 'draft', 'ready', 'posted'] as const

export default function InstagramCalendarPage() {
  const [filter, setFilter] = useState<string>('all')
  const posts = filter === 'all'
    ? instagramCalendar.posts
    : instagramCalendar.posts.filter(p => p.status === filter)

  return (
    <div style={{ background: BRAND_CONFIG.bgColor, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Image src={BRAND_CONFIG.logoPath} alt={BRAND_CONFIG.name} width={48} height={48} />
          <div>
            <h1 style={{ color: BRAND_CONFIG.accentColor, fontSize: 28, fontWeight: 900, margin: 0 }}>
              Instagram Calendar
            </h1>
            <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>
              {BRAND_CONFIG.instagramHandle} · {instagramCalendar.totalPosts} posts scheduled
            </p>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 20px',
                borderRadius: 4,
                border: `1px solid ${filter === s ? BRAND_CONFIG.accentColor : '#30363D'}`,
                background: filter === s ? BRAND_CONFIG.accentColor : 'transparent',
                color: filter === s ? '#0D1117' : '#999',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {posts.map(post => {
            const feedImg = `/images/instagram/feed/${post.id}.png`
            return (
              <div
                key={post.id}
                style={{
                  background: BRAND_CONFIG.cardBgColor,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #30363D',
                }}
              >
                {/* Feed image */}
                <div style={{ position: 'relative', aspectRatio: '1/1', background: '#0D1117' }}>
                  <Image
                    src={feedImg}
                    alt={post.headline}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                {/* Meta */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>{post.date} · {post.day}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
                      background: post.status === 'posted' ? '#1a3a1a' : post.status === 'ready' ? '#1a2a3a' : '#2a2a1a',
                      color: post.status === 'posted' ? '#4ade80' : post.status === 'ready' ? '#60a5fa' : '#fbbf24',
                      textTransform: 'uppercase',
                    }}>{post.status}</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>
                    {post.headline}
                  </h3>
                  {post.subheadline && (
                    <p style={{ color: BRAND_CONFIG.accentColor, fontSize: 12, margin: '0 0 8px' }}>
                      {post.subheadline}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#666', background: '#1a1a1a', padding: '2px 6px', borderRadius: 3 }}>
                      {post.template}
                    </span>
                    <span style={{ fontSize: 11, color: '#666', background: '#1a1a1a', padding: '2px 6px', borderRadius: 3 }}>
                      {post.bestTime}
                    </span>
                  </div>
                  {post.caption && (
                    <p style={{ color: '#888', fontSize: 12, margin: '8px 0 0', lineHeight: 1.5 }}>
                      {post.caption.length > 100 ? post.caption.slice(0, 100) + '…' : post.caption}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
