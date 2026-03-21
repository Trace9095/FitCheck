'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, ShoppingBag, Loader2, X, Check, Camera } from 'lucide-react'

const CATEGORIES = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories', 'Dresses']

interface WardrobeItem {
  id: string
  imageUrl: string
  category: string
  tags: string | null
  notes: string | null
  createdAt: string
}

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [filterCat, setFilterCat] = useState<string>('All')

  // Add item form
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function loadItems() {
    setLoading(true)
    const res = await fetch('/api/wardrobe')
    const json = await res.json()
    setItems(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { void loadItems() }, [])

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !category) return
    setSubmitting(true)

    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()

    if (!uploadRes.ok) { setSubmitting(false); return }

    await fetch('/api/wardrobe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: uploadData.data.url, category, tags: tags || undefined, notes: notes || undefined }),
    })

    setAdding(false)
    setPreview(null); setFile(null); setCategory(''); setTags(''); setNotes('')
    setSubmitting(false)
    void loadItems()
  }

  const filtered = filterCat === 'All' ? items : items.filter((i) => i.category === filterCat)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Wardrobe</h1>
          <p className="text-sm text-muted">{items.length} items in your closet</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`flex min-h-[36px] shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              filterCat === cat ? 'bg-gold text-background' : 'border border-border bg-surface text-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-muted" />
          <h2 className="font-bold text-foreground">Your wardrobe is empty</h2>
          <p className="mt-1 text-sm text-muted">Start photographing your closet.</p>
          <button onClick={() => setAdding(true)} className="mt-4 rounded-lg bg-gold px-6 py-2 text-sm font-semibold text-background">
            Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative aspect-square overflow-hidden">
                <Image src={item.imageUrl} alt={item.category} fill sizes="25vw" className="object-cover" quality={85} />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gold">{item.category}</p>
                {item.tags && <p className="mt-0.5 truncate text-xs text-muted">{item.tags}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add item modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border border-border bg-surface p-6 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-foreground">Add to Wardrobe</h2>
              <button onClick={() => setAdding(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-hover">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              {preview ? (
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={preview} alt="" fill className="object-cover" quality={85} />
                  <button type="button" onClick={() => { setPreview(null); setFile(null) }} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-gold">
                  <Camera className="h-8 w-8 text-gold" />
                  <p className="text-sm text-muted">Tap to add photo</p>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`min-h-[36px] rounded-lg border text-xs font-medium ${category === cat ? 'border-gold bg-gold/10 text-gold' : 'border-border bg-background text-muted'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (optional, e.g. vintage, Nike)" className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-gold" />

              <button type="submit" disabled={!file || !category || submitting}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-background disabled:opacity-50">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Add to Wardrobe
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
