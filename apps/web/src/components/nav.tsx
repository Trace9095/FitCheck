'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shirt } from 'lucide-react'

const navLinks = [
  { href: '/feed', label: 'Browse' },
  { href: '/rate', label: 'Rate Fits' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/blog', label: 'Blog' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-gold"
          aria-label="Fit Check home"
        >
          <Shirt className="h-5 w-5 text-gold" strokeWidth={2.5} aria-hidden="true" />
          Fit Check
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer — solid bg, no backdrop-blur (iOS Safari #31) */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gold text-base font-semibold text-background"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
