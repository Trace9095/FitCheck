import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/data/blog-posts'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://fitcheckapp.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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

      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link
            href="/"
            className="flex min-h-[44px] items-center transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/blog"
            className="flex min-h-[44px] items-center transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{post.category}</span>
        </nav>

        {/* Article header */}
        <article>
          <header className="mb-10">
            <span className="mb-4 inline-block rounded-full border border-gold px-3 py-1 text-xs font-medium text-gold">
              {post.category}
            </span>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <time dateTime={post.date}>{formattedDate}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Article content — safe: hardcoded TypeScript, never user input */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Back to blog */}
        <div className="mt-12 border-t border-border pt-8">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <span aria-hidden="true">&#8592;</span>
            Back to all posts
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground">
            Try Fit Check — Get Real Style Feedback
          </h2>
          <p className="mb-6 text-sm text-muted">
            Post your outfit, get anonymous ratings 1-10, and discover your style profile.
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
