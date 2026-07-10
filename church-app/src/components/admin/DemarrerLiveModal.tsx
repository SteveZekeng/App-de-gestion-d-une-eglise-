'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Radio, X } from 'lucide-react'

export default function DemarrerLiveModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const router = useRouter()
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [urlYoutube, setUrlYoutube] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    setIsLoading(true)
    setError('')
    const supabase = createClient()

    const { error } = await supabase.from('prieres').insert({
      titre: titre.trim(),
      description: description.trim() || null,
      type: 'live',
      statut: 'en_cours',
      url_video: urlYoutube.trim() || null,
      date_debut: new Date().toISOString(),
      createur_id: userId,
    })

    if (error) {
      setError('Une erreur est survenue, réessayez.')
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
        className="bg-black border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-white flex items-center gap-1.5">
            <Radio size={16} className="text-red-400" />
            Démarrer un live
          </h3>
          <button type="button" onClick={onClose} className="text-blue-200/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-blue-200/50 -mt-2">
          Diffusez depuis votre téléphone ou OBS vers YouTube Live, puis collez le lien ici. Vous pouvez aussi
          démarrer sans lien et l&apos;ajouter ensuite en modifiant la session.
        </p>

        <Input
          id="titre"
          label="Titre"
          placeholder="Veillée de prière en direct"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <Input
          id="urlYoutube"
          label="Lien YouTube Live (optionnel)"
          placeholder="https://www.youtube.com/watch?v=..."
          value={urlYoutube}
          onChange={(e) => setUrlYoutube(e.target.value)}
        />

        <Textarea
          id="description"
          label="Description (optionnel)"
          placeholder="Un moment de communion ensemble..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600">
          Mettre en direct
        </Button>
      </form>
    </div>
  )
}
