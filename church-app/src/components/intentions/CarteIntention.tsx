'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { Lock, Clock, CheckCircle2 } from 'lucide-react'
import type { Intention, ReponseIntention } from '@/types'

interface CarteIntentionProps {
  intention: Intention
  reponses: ReponseIntention[]
  peutRepondre: boolean
  responsableId?: string
}

const statutConfig = {
  en_attente: { label: 'En attente', color: 'bg-white/10 text-blue-100/70' },
  en_cours: { label: 'En cours', color: 'bg-amber-500/10 text-amber-300' },
  traitee: { label: 'Traitée', color: 'bg-emerald-500/10 text-emerald-300' },
}

export default function CarteIntention({
  intention,
  reponses,
  peutRepondre,
  responsableId,
}: CarteIntentionProps) {
  const router = useRouter()
  const [showReponseForm, setShowReponseForm] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReponse() {
    if (!commentaire.trim() || !responsableId) return

    setIsLoading(true)
    setError('')
    const supabase = createClient()

    const { error: reponseError } = await supabase.from('reponses_intention').insert({
      intention_id: intention.id,
      responsable_id: responsableId,
      commentaire: commentaire.trim(),
    })

    if (reponseError) {
      setError("L'envoi de la réponse a échoué : " + reponseError.message)
      setIsLoading(false)
      return
    }

    const { error: statutError } = await supabase
      .from('intentions')
      .update({ statut: 'traitee' })
      .eq('id', intention.id)

    if (statutError) {
      setError("La réponse a été enregistrée, mais le statut n'a pas pu être mis à jour : " + statutError.message)
      setIsLoading(false)
      return
    }

    setCommentaire('')
    setShowReponseForm(false)
    setIsLoading(false)
    router.refresh()
  }

  const statut = statutConfig[intention.statut]

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white text-sm">{intention.sujet}</h4>
            {intention.est_privee && (
              <Lock size={12} className="text-blue-200/40" />
            )}
          </div>
          {intention.description && (
            <p className="text-sm text-blue-200/60 mt-1">{intention.description}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statut.color}`}>
          {statut.label}
        </span>
      </div>

      <p className="text-xs text-blue-200/40 mt-3 flex items-center gap-1">
        <Clock size={12} />
        {new Date(intention.date_creation).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
      </p>

      {/* Réponses existantes */}
      {reponses.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          {reponses.map((rep) => (
            <div key={rep.id} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-2">
              <CheckCircle2 size={15} className="text-blue-300 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-100">{rep.commentaire}</p>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire de réponse (pasteur/admin) */}
      {peutRepondre && intention.statut !== 'traitee' && (
        <div className="mt-4 border-t border-white/10 pt-4">
          {showReponseForm ? (
            <div className="flex flex-col gap-2">
              <Textarea
                id={`reponse-${intention.id}`}
                placeholder="Votre réponse..."
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
              )}
              <div className="flex gap-2">
                <Button onClick={handleReponse} isLoading={isLoading} className="flex-1">
                  Envoyer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowReponseForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowReponseForm(true)}
              className="text-xs font-medium text-blue-400 hover:underline"
            >
              Répondre à cette intention
            </button>
          )}
        </div>
      )}
    </div>
  )
}