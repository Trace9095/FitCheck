import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Verify Link' }

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  const errorMessages: Record<string, string> = {
    missing_token: 'The link is missing a token. Request a new magic link.',
    invalid_token: 'This link has expired or is invalid. Request a new magic link.',
  }

  const message = error ? (errorMessages[error] ?? 'Something went wrong.') : 'Verifying...'
  const isError = Boolean(error)

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center">
      <AlertCircle className={`mx-auto mb-4 h-10 w-10 ${isError ? 'text-destructive' : 'text-gold'}`} />
      <h1 className="mb-2 text-xl font-bold text-foreground">
        {isError ? 'Link problem' : 'Verifying your link'}
      </h1>
      <p className="mb-6 text-sm text-muted">{message}</p>
      {isError && (
        <Link
          href="/login"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-gold px-6 py-2 text-sm font-semibold text-background"
        >
          Request new link
        </Link>
      )}
    </div>
  )
}
