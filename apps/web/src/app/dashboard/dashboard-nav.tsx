'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Shirt,
  TrendingUp,
  Trophy,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/users', label: 'Users', icon: Users, exact: false },
  { href: '/dashboard/content', label: 'Content', icon: Shirt, exact: false },
  { href: '/dashboard/revenue', label: 'Revenue', icon: TrendingUp, exact: false },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Trophy, exact: false },
]

interface DashboardNavProps {
  adminEmail: string
}

export function DashboardNav({ adminEmail }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-gold/10 text-gold'
                : 'text-muted hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
            <LayoutDashboard className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Fit Check</p>
            <p className="text-xs text-gold">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <NavLinks />
        </nav>

        <div className="border-t border-border p-4 space-y-1">
          <Link
            href="/feed"
            target="_blank"
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            View App
          </Link>
          <button
            onClick={() => void handleLogout()}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <p className="truncate px-3 pt-1 text-xs text-muted">{adminEmail}</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <span className="text-sm font-bold text-gold">Dashboard</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-hover"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-14 bottom-0 w-64 border-r border-border bg-surface p-4">
            <nav className="space-y-1">
              <NavLinks />
            </nav>
            <div className="mt-4 border-t border-border pt-4 space-y-1">
              <button
                onClick={() => void handleLogout()}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
