import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ArrowRight, Camera, Star, Zap, Trophy, Sparkles, Shirt, Users, TrendingUp } from 'lucide-react'

const categories = [
  { label: 'Streetwear', description: 'Urban edge meets high fashion' },
  { label: 'Business', description: 'Power dressing, refined' },
  { label: 'Casual', description: 'Effortless everyday style' },
  { label: 'Date Night', description: 'Turn heads, always' },
  { label: 'Festival', description: 'Bold, free, unapologetic' },
  { label: 'Gym', description: 'Performance meets aesthetic' },
]

const features = [
  {
    icon: Camera,
    title: 'Post Your OOTD',
    description: "Upload today's outfit and let the community rate your look anonymously from 1 to 10.",
  },
  {
    icon: Zap,
    title: 'Fit or Miss',
    description: 'Swipe through outfits, rate them, build your taste. Every swipe trains your style IQ.',
  },
  {
    icon: Sparkles,
    title: 'AI Style Profile',
    description: 'After enough rated fits, our AI defines your aesthetic — your color palette, signature pieces, and more.',
  },
  {
    icon: TrendingUp,
    title: 'Wardrobe Tracker',
    description: 'Photograph your entire closet. Get AI outfit suggestions for any occasion.',
  },
  {
    icon: Trophy,
    title: 'Style Challenges',
    description: 'Weekly themes, community competitions. Win recognition for your best fits.',
  },
  {
    icon: Users,
    title: 'Real Community',
    description: 'Anonymous ratings mean honest feedback. No clout-chasing, just pure style signal.',
  },
]

const stats = [
  { value: '10K+', label: 'Outfits Rated' },
  { value: '4.2', label: 'Avg Rating' },
  { value: '6', label: 'Style Categories' },
]

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative flex min-h-[85dvh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#D4A853 1px, transparent 1px), linear-gradient(90deg, #D4A853 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-5 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
            <Shirt className="h-4 w-4 text-gold" />
            Style rating, reimagined
          </div>

          <h1 className="mb-6 text-5xl font-black leading-none tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Rate your{' '}
            <span className="text-gold">fit.</span>
            <br />
            Find your{' '}
            <span className="text-gold">style.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl">
            Post your OOTD, get honest anonymous ratings. Swipe through fits, build your taste.
            Let AI define your aesthetic.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="flex min-h-[52px] items-center gap-2 rounded-xl bg-gold px-8 py-3 text-base font-bold text-background transition-opacity hover:opacity-90"
            >
              Post Your Fit Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/feed"
              className="flex min-h-[52px] items-center gap-2 rounded-xl border border-border bg-surface px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              Browse Fits
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-gold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Six Style <span className="text-gold">Categories</span>
            </h2>
            <p className="mt-3 text-muted">From boardroom to festival. Rate and discover every aesthetic.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/feed?category=${cat.label}`}
                className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold hover:bg-surface-hover"
              >
                <div className="text-sm font-semibold text-foreground group-hover:text-gold">{cat.label}</div>
                <div className="mt-1 text-xs text-muted">{cat.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-surface py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="text-gold">level up</span>
            </h2>
            <p className="mt-3 text-muted">Tools to understand your style, grow your taste, and get real feedback.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-gold/40"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                  <feature.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-3xl font-black tracking-tight sm:text-4xl">
            How it <span className="text-gold">works</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: '01', title: 'Post your OOTD', desc: 'Upload a photo of your outfit. Pick a category. Let the community see it.' },
              { step: '02', title: 'Get rated 1-10', desc: 'Anonymous community ratings pour in. Raw, honest feedback on your fit.' },
              { step: '03', title: 'Discover your style', desc: 'Patterns emerge. AI identifies your aesthetic and suggests how to elevate it.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 text-5xl font-black text-gold/20">{item.step}</div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold">
            <Star className="h-4 w-4 fill-gold text-gold" />
            Free to join
          </div>
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">
            Ready to know your <span className="text-gold">fit score?</span>
          </h2>
          <p className="mb-8 text-muted">
            Post your first outfit today. It only takes 30 seconds.
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-gold px-8 py-3 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-xs text-muted">No credit card. No app download. Just your fit.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
