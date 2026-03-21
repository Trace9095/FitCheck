'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shirt, Grid3X3, Zap, Camera, Trophy, User, LogOut, Menu, X, ShoppingBag } from 'lucide-react'

const navItems = [
  { href: '/feed', icon: Grid3X3, label: 'Feed' },
  { href: '/rate', icon: Zap, label: 'Rate' },
  { href: '/post', icon: Camera, label: 'Post' },
  { href: '/challenges', icon: Trophy, label: 'Challenges' },
  { href: '/wardrobe', icon: ShoppingBag, label: 'Wardrobe' },
]

interface AppNavProps {
  userEmail: string
}

export function AppNav({ userEmail }: AppNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const handle = userEmail.split('@')[0]

  return (
    <>
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/feed" className="flex items-center gap-2 text-lg font-bold text-gold">
            <Shirt className="h-5 w-5" strokeWidth={2.5} />
            Fit Check
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted hover:bg-surface hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${handle}`}
              className="hidden min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm text-muted hover:text-foreground md:flex"
            >
              <User className="h-4 w-4" />
              {handle}
            </Link>
            <button
              onClick={handleLogout}
              className="hidden min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm text-muted hover:text-foreground md:flex"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium ${
                  pathname === item.href ? 'bg-gold/10 text-gold' : 'text-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex min-h-[44px] w-full items-center gap-3 rounded-lg border-t border-border px-3 pt-2 text-sm text-muted"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background pb-safe md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-xs ${
                pathname === item.href ? 'text-gold' : 'text-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
