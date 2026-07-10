'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Send, Users } from 'lucide-react'
import type { LiveCommentaire } from '@/types'

interface LiveInteractionsProps {
  priereId: string
  userId: string
  nom: string
  prenom: string
}

export default function LiveInteractions({ priereId, userId, nom, prenom }: LiveInteractionsProps) {
  const [nbConnectes, setNbConnectes] = useState(1)
  const [nbLikes, setNbLikes] = useState(0)
  const [aLike, setALike] = useState(false)
  const [commentaires, setCommentaires] = useState<LiveCommentaire[]>([])
  const [nouveauCommentaire, setNouveauCommentaire] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Présence — nombre de fidèles ayant la session ouverte en ce moment
    const canalPresence = supabase.channel(`presence-live-${priereId}`, {
      config: { presence: { key: userId } },
    })
    canalPresence
      .on('presence', { event: 'sync' }, () => {
        const etat = canalPresence.presenceState()
        setNbConnectes(Object.keys(etat).length)
      })
      .subscribe((statut) => {
        if (statut === 'SUBSCRIBED') {
          canalPresence.track({ connecte_le: new Date().toISOString() })
        }
      })

    // Likes — chargement initial + écoute temps réel
    async function chargerLikes() {
      const { data, count } = await supabase
        .from('live_likes')
        .select('user_id', { count: 'exact' })
        .eq('priere_id', priereId)
      setNbLikes(count ?? 0)
      setALike(!!data?.some((l) => l.user_id === userId))
    }
    chargerLikes()

    const canalLikes = supabase
      .channel(`likes-${priereId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_likes', filter: `priere_id=eq.${priereId}` },
        () => chargerLikes()
      )
      .subscribe()

    // Commentaires — chargement initial + écoute temps réel
    async function chargerCommentaires() {
      const { data } = await supabase
        .from('live_commentaires')
        .select('*')
        .eq('priere_id', priereId)
        .order('date_creation', { ascending: true })
        .returns<LiveCommentaire[]>()
      setCommentaires(data ?? [])
    }
    chargerCommentaires()

    const canalCommentaires = supabase
      .channel(`commentaires-${priereId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_commentaires', filter: `priere_id=eq.${priereId}` },
        (payload) => {
          setCommentaires((prev) => [...prev, payload.new as LiveCommentaire])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canalPresence)
      supabase.removeChannel(canalLikes)
      supabase.removeChannel(canalCommentaires)
    }
  }, [priereId, userId])

  async function toggleLike() {
    const supabase = createClient()
    if (aLike) {
      await supabase.from('live_likes').delete().eq('priere_id', priereId).eq('user_id', userId)
    } else {
      await supabase.from('live_likes').insert({ priere_id: priereId, user_id: userId })
    }
  }

  async function envoyerCommentaire(e: React.FormEvent) {
    e.preventDefault()
    if (!nouveauCommentaire.trim()) return

    setEnvoiEnCours(true)
    const supabase = createClient()
    await supabase.from('live_commentaires').insert({
      priere_id: priereId,
      user_id: userId,
      nom_auteur: nom,
      prenom_auteur: prenom,
      contenu: nouveauCommentaire.trim(),
    })
    setNouveauCommentaire('')
    setEnvoiEnCours(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-sm text-blue-700/70 dark:text-blue-200/60">
          <Users size={15} />
          {nbConnectes} connecté{nbConnectes === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            aLike ? 'text-red-400' : 'text-blue-700/70 dark:text-blue-200/60 hover:text-red-400'
          }`}
        >
          <Heart size={15} className={aLike ? 'fill-red-400' : ''} />
          {nbLikes}
        </button>
      </div>

      <div className="bg-blue-900/4 dark:bg-white/5 rounded-2xl border border-blue-900/10 dark:border-white/10 p-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
        {commentaires.length === 0 ? (
          <p className="text-xs text-blue-700/50 dark:text-blue-200/40 text-center py-4">
            Aucun commentaire pour le moment
          </p>
        ) : (
          commentaires.map((com) => (
            <div key={com.id} className="text-sm">
              <span className="font-medium text-foreground">
                {com.prenom_auteur} {com.nom_auteur}
              </span>{' '}
              <span className="text-blue-900/80 dark:text-blue-100/80">{com.contenu}</span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={envoyerCommentaire} className="flex gap-2">
        <input
          value={nouveauCommentaire}
          onChange={(e) => setNouveauCommentaire(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="flex-1 rounded-xl border border-blue-900/15 dark:border-white/10 bg-blue-900/4 dark:bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
        />
        <button
          type="submit"
          disabled={envoiEnCours || !nouveauCommentaire.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white disabled:opacity-50 shrink-0"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
