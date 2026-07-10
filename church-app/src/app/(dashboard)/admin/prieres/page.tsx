'use client'

import { Fragment, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import FormulairePriere from '@/components/admin/FormulairePriere'
import DemarrerLiveModal from '@/components/admin/DemarrerLiveModal'
import LiveInteractions from '@/components/prieres/LiveInteractions'
import { Plus, Pencil, Trash2, Radio, Square } from 'lucide-react'
import type { Priere } from '@/types'

const statutColors = {
  planifie: 'bg-white/10 text-blue-100/70',
  en_cours: 'bg-red-500/10 text-red-300',
  termine: 'bg-emerald-500/10 text-emerald-300',
}

export default function AdminPrieresPage() {
  const [prieres, setPrieres] = useState<Priere[]>([])
  const [userId, setUserId] = useState<string>('')
  const [nom, setNom] = useState<string>('')
  const [prenom, setPrenom] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [showLiveModal, setShowLiveModal] = useState(false)
  const [priereEdition, setPriereEdition] = useState<Priere | undefined>()
  const [error, setError] = useState('')

  async function fetchPrieres() {
    const supabase = createClient()
    const { data } = await supabase
      .from('prieres')
      .select('*')
      .order('date_creation', { ascending: false })
      .returns<Priere[]>()
    setPrieres(data ?? [])
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: profil } = await supabase
        .from('utilisateurs')
        .select('nom, prenom')
        .eq('id', data.user.id)
        .single()
      if (profil) {
        setNom(profil.nom)
        setPrenom(profil.prenom)
      }
    })
    fetchPrieres()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette session de prière ?')) return
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('prieres').delete().eq('id', id)
    if (error) {
      setError("La suppression a échoué : " + error.message)
      return
    }
    fetchPrieres()
  }

  async function handleTerminerLive(id: string) {
    if (!confirm('Terminer ce live ? Il sera publié comme rediffusion pour tous les fidèles.')) return
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('prieres')
      .update({ statut: 'termine', type: 'rediffusion', date_fin: new Date().toISOString() })
      .eq('id', id)
    if (error) {
      setError('La clôture du live a échoué : ' + error.message)
      return
    }
    fetchPrieres()
  }

  function openCreate() {
    setPriereEdition(undefined)
    setShowForm(true)
  }

  function openEdit(priere: Priere) {
    setPriereEdition(priere)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    fetchPrieres()
  }

  function closeLiveModal() {
    setShowLiveModal(false)
    fetchPrieres()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Gestion des prières</h1>
          <p className="text-sm text-blue-200/60 mt-1">Créer et gérer les sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowLiveModal(true)}
            className="gap-1.5 bg-red-600 hover:bg-red-700 from-red-600 to-red-600"
          >
            <Radio size={16} />
            Démarrer un live
          </Button>
          <Button onClick={openCreate} variant="secondary" className="gap-1.5">
            <Plus size={16} />
            Nouvelle session
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        {prieres.length === 0 ? (
          <p className="text-sm text-blue-200/50 text-center py-10">Aucune session créée</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-blue-200/50">
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {prieres.map((priere) => (
                <Fragment key={priere.id}>
                  <tr key={priere.id} className="border-b border-white/10 last:border-0">
                    <td className="px-5 py-3 font-medium text-white">{priere.titre}</td>
                    <td className="px-5 py-3 text-blue-200/60 capitalize">{priere.type}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statutColors[priere.statut]}`}>
                        {priere.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-blue-200/60">
                      {priere.date_debut
                        ? new Date(priere.date_debut).toLocaleDateString('fr-FR', { dateStyle: 'medium' })
                        : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {priere.statut === 'en_cours' && (
                          <button
                            onClick={() => handleTerminerLive(priere.id)}
                            className="p-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg"
                            title="Terminer le live"
                          >
                            <Square size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(priere)}
                          className="p-1.5 text-blue-200/50 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(priere.id)}
                          className="p-1.5 text-blue-200/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {priere.statut === 'en_cours' && userId && (
                    <tr className="border-b border-white/10 last:border-0 bg-red-500/5">
                      <td colSpan={5} className="px-5 py-4">
                        <LiveInteractions priereId={priere.id} userId={userId} nom={nom} prenom={prenom} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showForm && <FormulairePriere userId={userId} priereExistante={priereEdition} onClose={closeForm} />}
      {showLiveModal && <DemarrerLiveModal userId={userId} onClose={closeLiveModal} />}
    </div>
  )
}
