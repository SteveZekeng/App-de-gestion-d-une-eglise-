'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Lock, Globe } from 'lucide-react'

export default function FormulaireIntention({ userId }: { userId: string }) {
  const router = useRouter()
  const [sujet, setSujet] = useState('')
  const [description, setDescription] = useState('')
  const [estPrivee, setEstPrivee] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!sujet.trim()) {
      setError('Le sujet est obligatoire.')
      return
    }

    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('intentions').insert({
      user_id: userId,
      sujet: sujet.trim(),
      description: description.trim() || null,
      est_privee: estPrivee,
      statut: 'en_attente',
    })

    if (error) {
      setError("Une erreur est survenue, réessayez.")
      setIsLoading(false)
      return
    }

    setSujet('')
    setDescription('')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-4"
    >
      <h3 className="font-display text-sm font-semibold text-white">Déposer une intention</h3>

      <Input
        id="sujet"
        placeholder="Sujet de votre demande..."
        value={sujet}
        onChange={(e) => setSujet(e.target.value)}
      />

      <Textarea
        id="description"
        placeholder="Décrivez votre intention (optionnel)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEstPrivee(true)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
            estPrivee
              ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
              : 'bg-white/5 border-white/10 text-blue-200/50'
          }`}
        >
          <Lock size={13} />
          Privée
        </button>
        <button
          type="button"
          onClick={() => setEstPrivee(false)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
            !estPrivee
              ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
              : 'bg-white/5 border-white/10 text-blue-200/50'
          }`}
        >
          <Globe size={13} />
          Visible par les responsables
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Envoyer ma demande
      </Button>
    </form>
  )
}