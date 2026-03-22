import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/data/blog-posts'

export const metadata: Metadata = {
  title: 'Blog — Style Tips & Fashion Advice',
  description: 'Style tips, outfit advice, fashion community insights, and wardrobe guides from the Fit Check team.',
  openGraph: {
    title: 'Fit Check Blog — Style Tips & Fashion Advice',
    description: 'Style tips, outfit advice, fashion community insights, and wardrobe guides from the Fit Check team.',
    url: 'https://fitcheckapp.com/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href="/"
            className="inline-block text-sm text-muted transition-colors hover:text-gold"
          >
            Fit Check
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Page heading */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            Fit Check Blog
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Style tips, outfit advice, fashion community insights, and wardrobe guides.
          </p>
        </div>

        {/* Blog post grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex min-h-[44px] flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold hover:bg-surface-hover"
            >
              {/* Category badge */}
              <span className="mb-3 inline-block self-start rounded-full border border-gold px-3 py-1 text-xs font-medium text-gold">
                {post.category}
              </span>

              {/* Title */}
              <h2 className="mb-3 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-gold">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Ready to level up your style?
          </h2>
          <p className="mb-6 text-muted">
            Post your OOTD, collect honest anonymous ratings, and discover your true aesthetic.
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-8 font-bold text-background transition-opacity hover:opacity-90"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </div>
  )
}
