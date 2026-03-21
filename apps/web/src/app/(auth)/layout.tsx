import type { Metadata } from 'next'
import { Shirt } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Fit Check',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-gold">
          <Shirt className="h-6 w-6" strokeWidth={2.5} />
          Fit Check
        </Link>
        <p className="mt-1 text-sm text-muted">Rate your fit. Find your style.</p>
      </div>
      {children}
    </div>
  )
}
