'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, UserX, UserCheck, Trash2 } from 'lucide-react'
import type { Utilisateur, UserRole } from '@/types'

const roleColors: Record<UserRole, string> = {
  fidele: 'bg-white/10 text-blue-100/70',
  pasteur: 'bg-blue-500/10 text-blue-300',
  admin: 'bg-amber-500/10 text-amber-300',
}

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [monId, setMonId] = useState<string>('')
  const [error, setError] = useState('')

  async function fetchUtilisateurs() {
    const supabase = createClient()
    const { data } = await supabase
      .from('utilisateurs')
      .select('*')
      .order('date_creation', { ascending: false })
      .returns<Utilisateur[]>()
    setUtilisateurs(data ?? [])
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMonId(data.user.id)
    })
    fetchUtilisateurs()
  }, [])

  async function changerRole(userId: string, nouveauRole: UserRole) {
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('utilisateurs').update({ role: nouveauRole }).eq('id', userId)
    if (error) setError('La mise à jour du rôle a échoué : ' + error.message)
    fetchUtilisateurs()
  }

  async function toggleActif(userId: string, estActif: boolean) {
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('utilisateurs').update({ est_actif: !estActif }).eq('id', userId)
    if (error) setError('La mise à jour du statut a échoué : ' + error.message)
    fetchUtilisateurs()
  }

  async function supprimerCompte(userId: string, nomComplet: string) {
    if (
      !confirm(
        `Supprimer définitivement le compte de ${nomComplet} ? Cette action est irréversible (contrairement à la désactivation).`
      )
    )
      return

    setError('')
    const reponse = await fetch(`/api/admin/utilisateurs/${userId}`, { method: 'DELETE' })
    const resultat = await reponse.json()

    if (!reponse.ok) {
      setError(resultat.error ?? 'La suppression a échoué.')
      return
    }

    fetchUtilisateurs()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Utilisateurs</h1>
        <p className="text-sm text-blue-200/60 mt-1">Gérer les membres et leurs rôles</p>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
       <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-blue-200/50">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Rôle</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.id} className="border-b border-white/10 last:border-0">
                <td className="px-5 py-3 font-medium text-white">
                  {u.prenom} {u.nom}
                  {u.id === monId && (
                    <span className="text-[10px] text-blue-200/40 ml-1.5">(vous)</span>
                  )}
                </td>
                <td className="px-5 py-3 text-blue-200/60">{u.email}</td>
                <td className="px-5 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changerRole(u.id, e.target.value as UserRole)}
                    disabled={u.id === monId}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${roleColors[u.role]}`}
                  >
                    <option value="fidele" className="bg-black">Fidèle</option>
                    <option value="pasteur" className="bg-black">Pasteur</option>
                    <option value="admin" className="bg-black">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.est_actif ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-blue-100/60'
                    }`}
                  >
                    {u.est_actif ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.id !== monId && (
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => toggleActif(u.id, u.est_actif)}
                        className="p-1.5 text-blue-200/50 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                        title={u.est_actif ? 'Désactiver' : 'Réactiver'}
                      >
                        {u.est_actif ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => supprimerCompte(u.id, `${u.prenom} ${u.nom}`)}
                        className="p-1.5 text-blue-200/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
      </div>

      <p className="text-xs text-blue-200/40 flex items-center gap-1.5">
        <ShieldCheck size={13} />
        Désactiver bloque l&apos;accès sans perdre les données ; supprimer est définitif et irréversible.
        Vous ne pouvez pas modifier votre propre rôle, ni vous désactiver ou vous supprimer vous-même.
      </p>
    </div>
  )
}