import Link from 'next/link'
import { Shirt } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="mb-2 flex items-center gap-2 text-lg font-bold text-gold">
              <Shirt className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              Fit Check
            </div>
            <p className="text-sm text-muted">
              Rate your fit. Find your style. Post your OOTD and get real feedback from the community.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">App</p>
              <ul className="flex flex-col gap-2">
                {[
                  { href: '/feed', label: 'Browse Fits' },
                  { href: '/rate', label: 'Rate Fits' },
                  { href: '/post', label: 'Post Outfit' },
                  { href: '/challenges', label: 'Challenges' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Account</p>
              <ul className="flex flex-col gap-2">
                {[
                  { href: '/login', label: 'Sign In' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/style', label: 'Style Profile' },
                  { href: '/wardrobe', label: 'Wardrobe' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Legal</p>
              <ul className="flex flex-col gap-2">
                {[
                  { href: '/privacy', label: 'Privacy' },
                  { href: '/terms', label: 'Terms' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Fit Check. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
