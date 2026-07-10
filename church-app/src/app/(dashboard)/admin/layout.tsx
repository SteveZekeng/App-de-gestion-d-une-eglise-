import { redirect } from 'next/navigation'
import { getProfil } from '@/lib/supabase/auth'
import AdminNav from '@/components/layout/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profil = await getProfil()

  if (!profil || (profil.role !== 'pasteur' && profil.role !== 'admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminNav />
      {children}
    </div>
  )
}
