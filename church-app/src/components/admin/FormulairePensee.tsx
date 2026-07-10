'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ImagePlus, Sparkles, X } from 'lucide-react'

export default function FormulairePensee({ userId }: { userId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [apercu, setApercu] = useState<string | null>(null)
  const [referenceBiblique, setReferenceBiblique] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    setImage(fichier)
    setApercu(URL.createObjectURL(fichier))
  }

  function retirerImage() {
    setImage(null)
    setApercu(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!image) {
      setError('Ajoutez une image pour la pensée du jour.')
      return
    }

    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
    if (!typesAutorises.includes(image.type)) {
      setError('Format non pris en charge. Utilisez JPEG, PNG, WebP ou GIF.')
      return
    }

    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const ext = image.name.includes('.') ? '.' + image.name.split('.').pop() : ''
    const base = image.name.replace(/\.[^.]+$/, '')
    const nomSanitise = (base
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '') || 'pensee') + ext
    const cheminFichier = `${userId}/${Date.now()}-${nomSanitise}`

    const { error: uploadError } = await supabase.storage
      .from('pensees')
      .upload(cheminFichier, image)

    if (uploadError) {
      setError("L'upload de l'image a échoué, réessayez.")
      setIsLoading(false)
      return
    }

    const { data: urlPublique } = supabase.storage.from('pensees').getPublicUrl(cheminFichier)

    const { error: insertError } = await supabase.from('pensees_du_jour').insert({
      image_url: urlPublique.publicUrl,
      reference_biblique: referenceBiblique.trim() || null,
      createur_id: userId,
    })

    if (insertError) {
      setError('Une erreur est survenue, réessayez.')
      setIsLoading(false)
      return
    }

    retirerImage()
    setReferenceBiblique('')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" aria-hidden />

      <h3 className="relative font-display text-sm font-semibold text-white flex items-center gap-1.5">
        <Sparkles size={15} className="text-blue-300" />
        Publier la pensée du jour
      </h3>

      <input
        ref={fileInputRef}
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {apercu ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={apercu} alt="Aperçu de la pensée du jour" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={retirerImage}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 aspect-video rounded-xl border-2 border-dashed border-white/15 bg-white/5 text-blue-200/60 hover:border-blue-400/40 hover:text-blue-200 hover:bg-blue-500/5 transition-colors"
        >
          <ImagePlus size={24} />
          <span className="text-xs font-medium">Cliquez pour ajouter une image</span>
        </button>
      )}

      <Input
        id="referenceBiblique"
        placeholder="Accroche ou référence — Psaume 23:1"
        value={referenceBiblique}
        onChange={(e) => setReferenceBiblique(e.target.value)}
      />

      {error && (
        <p className="relative text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="relative w-fit">
        Publier
      </Button>
    </form>
  )
}
