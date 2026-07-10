import { redirect } from 'next/navigation'
import { getAuthUser, getProfil } from '@/lib/supabase/auth'
import Navbar from '@/components/layout/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authUser = await getAuthUser()

  if (!authUser) {
    redirect('/login')
  }

  const profil = await getProfil()

  if (!profil) {
    redirect('/login')
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div
        className="pointer-events-none fixed -top-40 -left-32 h-96 w-96 rounded-full bg-blue-700/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10">
        <Navbar user={profil} />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  )
}