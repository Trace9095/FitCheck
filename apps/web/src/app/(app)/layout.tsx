import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppNav } from '@/components/app-nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppNav userEmail={session.email} />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6">
        {children}
      </main>
    </div>
  )
}
