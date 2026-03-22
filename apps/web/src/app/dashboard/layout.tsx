import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'
import { DashboardNav } from './dashboard-nav'

export const metadata = {
  title: { default: 'Dashboard', template: '%s | Fit Check Dashboard' },
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('session')?.value)

  if (!session?.email || !isAdmin(session.email)) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-[100dvh] bg-background">
      <DashboardNav adminEmail={session.email} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
