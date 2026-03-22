import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import {
  ArrowRight,
  Camera,
  Star,
  Zap,
  Trophy,
  Sparkles,
  Shirt,
  Users,
  TrendingUp,
  CheckCircle,
  Upload,
  BarChart2,
} from 'lucide-react'

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
    description:
      'Upload today\'s outfit and let the community rate your look anonymously from 1 to 10.',
  },
  {
    icon: Zap,
    title: 'Fit or Miss',
    description:
      'Swipe through outfits, rate them, build your taste. Every swipe trains your style IQ.',
  },
  {
    icon: Sparkles,
    title: 'AI Style Profile',
    description:
      'After enough rated fits, our AI defines your aesthetic — your color palette, signature pieces, and more.',
  },
  {
    icon: TrendingUp,
    title: 'Wardrobe Tracker',
    description:
      'Photograph your entire closet. Get AI outfit suggestions for any occasion.',
  },
  {
    icon: Trophy,
    title: 'Style Challenges',
    description:
      'Weekly themes, community competitions. Win recognition for your best fits.',
  },
  {
    icon: Users,
    title: 'Real Community',
    description:
      'Anonymous ratings mean honest feedback. No clout-chasing, just pure style signal.',
  },
]

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Post Your OOTD',
    desc: 'Upload a photo of your outfit. Pick a category. Let the community see it.',
  },
  {
    icon: Star,
    step: '02',
    title: 'Get Rated 1-10',
    desc: 'Anonymous community ratings pour in. Raw, honest feedback on your fit.',
  },
  {
    icon: BarChart2,
    step: '03',
    title: 'Discover Your Style',
    desc: 'Patterns emerge. AI identifies your aesthetic and suggests how to elevate it.',
  },
]

const testimonials = [
  {
    quote:
      'I posted my first fit not knowing what to expect. Got a 9.2. Now I\'m obsessed with leveling up my wardrobe.',
    name: 'Jordan M.',
    handle: '@jordanfits',
    score: '9.2',
  },
  {
    quote:
      'The AI style profile nailed me perfectly — "dark minimalist with a streetwear edge." I didn\'t even know that was a thing.',
    name: 'Priya S.',
    handle: '@priyalooks',
    score: '8.7',
  },
  {
    quote:
      'Fit Check killed my habit of asking friends for fashion advice. Anonymous ratings are brutally honest. That\'s exactly what I needed.',
    name: 'Marcus T.',
    handle: '@marcustanner',
    score: '8.4',
  },
]

const stats = [
  { value: '10K+', label: 'Outfits Rated' },
  { value: '4.2', label: 'Avg Fit Score' },
  { value: '6', label: 'Style Categories' },
]

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#D4A853 1px, transparent 1px), linear-gradient(90deg, #D4A853 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '640px',
            height: '640px',
            background:
              'radial-gradient(circle, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 50%, transparent 70%)',
          }}
        />
        {/* Secondary glow offset */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: '60%',
            top: '30%',
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-muted">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gold">
              <Shirt className="h-3 w-3 text-background" strokeWidth={2.5} />
            </div>
            Style rating, reimagined
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-black leading-none tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Rate your{' '}
            <span
              className="text-gold"
              style={{ textShadow: '0 0 40px rgba(212,168,83,0.35)' }}
            >
              fit.
            </span>
            <br />
            Find your{' '}
            <span
              className="text-gold"
              style={{ textShadow: '0 0 40px rgba(212,168,83,0.35)' }}
            >
              style.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Post your OOTD, get honest anonymous ratings from 1 to 10. Swipe
            through fits, build your taste. Let AI define your aesthetic.
          </p>

          {/* CTAs */}
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
              className="flex min-h-[52px] items-center gap-2 rounded-xl border border-border bg-surface px-8 py-3 text-base font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-surface-hover"
            >
              Browse Fits
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-gold text-gold"
                aria-hidden="true"
              />
            ))}
            <span className="ml-2 text-sm text-muted">
              Loved by style communities worldwide
            </span>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl font-black text-gold"
                  style={{ textShadow: '0 0 20px rgba(212,168,83,0.3)' }}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Explore
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Six Style{' '}
              <span className="text-gold">Categories</span>
            </h2>
            <p className="mt-3 text-muted">
              From boardroom to festival. Rate and discover every aesthetic.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/feed?category=${cat.label}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-gold/60 hover:bg-surface-hover"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at top left, rgba(212,168,83,0.06) 0%, transparent 70%)',
                  }}
                />
                <div className="relative">
                  <div className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-gold">
                    {cat.label}
                  </div>
                  <div className="text-xs text-muted">{cat.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border bg-surface py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Features
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="text-gold">level up</span>
            </h2>
            <p className="mt-3 text-muted">
              Tools to understand your style, grow your taste, and get real feedback.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 transition-all duration-200 hover:border-gold/40"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at top left, rgba(212,168,83,0.04) 0%, transparent 70%)',
                  }}
                />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Simple
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              How it <span className="text-gold">works</span>
            </h2>
            <p className="mt-3 text-muted">
              Three steps to go from outfit to insight.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute left-[calc(50%+36px)] top-7 hidden h-px w-[calc(100%-72px)] sm:block"
                    style={{ background: 'linear-gradient(90deg, #30363D 0%, transparent 100%)' }}
                  />
                )}
                {/* Icon circle */}
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
                  <item.icon className="h-6 w-6 text-gold" />
                  <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-black text-background">
                    {idx + 1}
                  </div>
                </div>
                <div className="mb-1 text-6xl font-black text-gold/10 leading-none">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-border bg-surface py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Community
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Real people.{' '}
              <span className="text-gold">Real ratings.</span>
            </h2>
            <p className="mt-3 text-muted">
              What the Fit Check community is saying.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.handle}
                className="relative overflow-hidden rounded-xl border border-border bg-background p-6"
              >
                {/* Score badge */}
                <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-3 py-1">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  <span className="text-xs font-bold text-gold">{t.score}</span>
                </div>
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-xs font-bold text-gold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted">{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-5 py-2 text-sm font-medium text-gold">
            <CheckCircle className="h-4 w-4" />
            Free to join
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-5xl">
            Ready to know your{' '}
            <span
              className="text-gold"
              style={{ textShadow: '0 0 30px rgba(212,168,83,0.3)' }}
            >
              fit score?
            </span>
          </h2>
          <p className="mb-8 text-lg text-muted">
            Post your first outfit today. It only takes 30 seconds.
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-gold px-10 py-3 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-5 text-xs text-muted">
            No credit card. No app download. Just your fit.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
