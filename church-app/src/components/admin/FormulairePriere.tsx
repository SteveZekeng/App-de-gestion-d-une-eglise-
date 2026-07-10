'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { X } from 'lucide-react'
import type { Priere, PriereType, PriereStatut } from '@/types'

interface FormulairePriereProps {
  userId: string
  priereExistante?: Priere
  valeursParDefaut?: { type?: PriereType; statut?: PriereStatut }
  onClose: () => void
}

// new Date(iso).toISOString().slice(0, 16) renvoie l'heure UTC, alors que
// <input type="datetime-local"> affiche/attend l'heure locale du navigateur.
function toLocalDatetimeValue(iso: string): string {
  const date = new Date(iso)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export default function FormulairePriere({
  userId,
  priereExistante,
  valeursParDefaut,
  onClose,
}: FormulairePriereProps) {
  const router = useRouter()
  const [titre, setTitre] = useState(priereExistante?.titre ?? '')
  const [description, setDescription] = useState(priereExistante?.description ?? '')
  const [type, setType] = useState<PriereType>(priereExistante?.type ?? valeursParDefaut?.type ?? 'live')
  const [statut, setStatut] = useState<PriereStatut>(
    priereExistante?.statut ?? valeursParDefaut?.statut ?? 'planifie'
  )
  const [urlVideo, setUrlVideo] = useState(priereExistante?.url_video ?? '')
  const [dateDebut, setDateDebut] = useState(
    priereExistante?.date_debut ? toLocalDatetimeValue(priereExistante.date_debut) : ''
  )
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    setIsLoading(true)
    setError('')
    const supabase = createClient()

    const payload = {
      titre: titre.trim(),
      description: description.trim() || null,
      type,
      statut,
      url_video: urlVideo.trim() || null,
      date_debut: dateDebut ? new Date(dateDebut).toISOString() : null,
      createur_id: userId,
    }

    const { error } = priereExistante
      ? await supabase.from('prieres').update(payload).eq('id', priereExistante.id)
      : await supabase.from('prieres').insert(payload)

    if (error) {
      setError("Une erreur est survenue, réessayez.")
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-black border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-white">
            {priereExistante ? 'Modifier la session' : 'Nouvelle session de prière'}
          </h3>
          <button type="button" onClick={onClose} className="text-blue-200/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <Input
          id="titre"
          label="Titre"
          placeholder="Veillée de prière du dimanche"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Un moment de communion ensemble..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-blue-100/80">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PriereType)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="live" className="bg-black">Live</option>
              <option value="rediffusion" className="bg-black">Rediffusion</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-blue-100/80">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as PriereStatut)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="planifie" className="bg-black">Planifié</option>
              <option value="en_cours" className="bg-black">En cours</option>
              <option value="termine" className="bg-black">Terminé</option>
            </select>
          </div>
        </div>

        <Input
          id="urlVideo"
          label="URL YouTube"
          placeholder="https://www.youtube.com/watch?v=..."
          value={urlVideo}
          onChange={(e) => setUrlVideo(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateDebut" className="text-sm font-medium text-blue-100/80">
            Date et heure
          </label>
          <input
            id="dateDebut"
            type="datetime-local"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {error && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full">
          {priereExistante ? 'Enregistrer les modifications' : 'Créer la session'}
        </Button>
      </form>
    </div>
  )
}