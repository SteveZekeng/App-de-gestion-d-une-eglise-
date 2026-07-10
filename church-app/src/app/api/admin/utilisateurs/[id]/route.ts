import { NextResponse, type NextRequest } from 'next/server'
import { getAuthUser, getProfil } from '@/lib/supabase/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const profil = await getProfil()
  if (!profil || (profil.role !== 'admin' && profil.role !== 'pasteur')) {
    return NextResponse.json({ error: 'Action réservée aux administrateurs.' }, { status: 403 })
  }

  const { id } = await params

  if (id === authUser.id) {
    return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Vérifier le rôle de la cible : un pasteur ne peut pas supprimer un admin/pasteur
  const { data: cible } = await admin.from('utilisateurs').select('role').eq('id', id).single()
  if (!cible) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })
  }
  if (profil.role === 'pasteur' && (cible.role === 'admin' || cible.role === 'pasteur')) {
    return NextResponse.json({ error: 'Vous ne pouvez pas supprimer un compte de rang supérieur ou égal.' }, { status: 403 })
  }

  // Supprimer d'abord le compte auth (priorité sécurité) puis le profil
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(id)
  if (deleteAuthError) {
    return NextResponse.json({ error: deleteAuthError.message }, { status: 500 })
  }

  await admin.from('utilisateurs').delete().eq('id', id)

  return NextResponse.json({ success: true })
}
