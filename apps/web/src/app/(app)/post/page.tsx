'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, X, Loader2, Check, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { value: 'Streetwear', label: 'Streetwear' },
  { value: 'Business', label: 'Business' },
  { value: 'Casual', label: 'Casual' },
  { value: 'DateNight', label: 'Date Night' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Gym', label: 'Gym' },
]

type PostStatus = 'idle' | 'uploading' | 'posting' | 'done' | 'error'

export default function PostPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState<PostStatus>('idle')
  const [error, setError] = useState('')

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    setError('')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function clearImage() {
    setPreview(null)
    setFile(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !category) return

    setStatus('uploading')
    setError('')

    try {
      // Upload image
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setError(uploadData.error ?? 'Upload failed.')
        setStatus('error')
        return
      }

      // Create outfit
      setStatus('posting')
      const postRes = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.data.url,
          category,
          caption: caption || undefined,
        }),
      })
      const postData = await postRes.json()

      if (!postRes.ok) {
        setError(postData.error ?? 'Failed to post.')
        setStatus('error')
        return
      }

      setStatus('done')
      setTimeout(() => router.push('/feed'), 1500)
    } catch {
      setError('Something went wrong.')
      setStatus('error')
    }
  }

  const isSubmitting = status === 'uploading' || status === 'posting' || status === 'done'

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Post Your Fit</h1>
        <p className="mt-1 text-sm text-muted">Share today's look with the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Image upload */}
        <div>
          {preview ? (
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border">
                <Image src={preview} alt="Preview" fill className="object-cover" quality={90} />
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-gold"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gold/10">
                <Camera className="h-8 w-8 text-gold" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Drop photo or tap to select</p>
                <p className="mt-1 text-sm text-muted">JPG, PNG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Category *</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex min-h-[44px] items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-surface text-muted hover:border-gold/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Caption <span className="text-muted">(optional)</span>
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="Describe your fit..."
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-gold"
          />
          <p className="mt-1 text-right text-xs text-muted">{caption.length}/500</p>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!file || !category || isSubmitting}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gold text-base font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'uploading' && (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          )}
          {status === 'posting' && (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Posting...
            </>
          )}
          {status === 'done' && (
            <>
              <Check className="h-5 w-5" />
              Posted!
            </>
          )}
          {(status === 'idle' || status === 'error') && (
            <>
              Post Fit
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
