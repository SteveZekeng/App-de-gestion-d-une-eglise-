'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { X, Link2, UploadCloud, FileVideo } from 'lucide-react'
import { cn, estUrlYoutube } from '@/lib/utils'
import type { VideoMotivation } from '@/types'

interface FormulaireVideoProps {
  userId: string
  videoExistante?: VideoMotivation
  onClose: () => void
}

type SourceVideo = 'youtube' | 'fichier'

export default function FormulaireVideo({ userId, videoExistante, onClose }: FormulaireVideoProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<SourceVideo>(
    videoExistante && !estUrlYoutube(videoExistante.url_video) ? 'fichier' : 'youtube'
  )
  const [titre, setTitre] = useState(videoExistante?.titre ?? '')
  const [description, setDescription] = useState(videoExistante?.description ?? '')
  const [urlYoutube, setUrlYoutube] = useState(
    videoExistante && estUrlYoutube(videoExistante.url_video) ? videoExistante.url_video : ''
  )
  const [fichierVideo, setFichierVideo] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleFichierChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    setFichierVideo(fichier)
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (!titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    if (source === 'youtube' && !urlYoutube.trim()) {
      setError('Indiquez le lien YouTube de la vidéo.')
      return
    }

    if (source === 'fichier' && !fichierVideo && !videoExistante) {
      setError('Importez un fichier vidéo.')
      return
    }

    if (source === 'fichier' && fichierVideo) {
      const typesAutorises = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
      if (!typesAutorises.includes(fichierVideo.type)) {
        setError('Format non pris en charge. Utilisez MP4, WebM, MOV ou MKV.')
        return
      }
    }

    setIsLoading(true)
    setError('')
    const supabase = createClient()

    let urlVideoFinale = source === 'youtube' ? urlYoutube.trim() : videoExistante?.url_video ?? ''

    if (source === 'fichier' && fichierVideo) {
      // Supabase Storage rejette les clés contenant accents, espaces ou caractères
      // spéciaux (tirets longs, parenthèses...). On conserve uniquement les
      // caractères alphanumériques, le point, le tiret et l'underscore.
      const ext = fichierVideo.name.includes('.') ? '.' + fichierVideo.name.split('.').pop() : ''
      const base = fichierVideo.name.replace(/\.[^.]+$/, '')
      const nomSanitise = (base
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '') || 'video') + ext
      const cheminFichier = `${userId}/${Date.now()}-${nomSanitise}`
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(cheminFichier, fichierVideo)

      if (uploadError) {
        setError(`Upload échoué : ${uploadError.message}`)
        setIsLoading(false)
        return
      }

      const { data: urlPublique } = supabase.storage.from('videos').getPublicUrl(cheminFichier)
      urlVideoFinale = urlPublique.publicUrl
    }

    const payload = {
      titre: titre.trim(),
      description: description.trim() || null,
      url_video: urlVideoFinale,
      createur_id: userId,
    }

    const { error } = videoExistante
      ? await supabase.from('videos_motivation').update(payload).eq('id', videoExistante.id)
      : await supabase.from('videos_motivation').insert(payload)

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
        className="bg-black border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-white">
            {videoExistante ? 'Modifier la vidéo' : 'Publier une vidéo'}
          </h3>
          <button type="button" onClick={onClose} className="text-blue-200/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <Input
          id="titre"
          label="Titre"
          placeholder="Culte d'enseignement du dimanche"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Un mot d'encouragement pour la semaine..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-blue-100/80">Source de la vidéo</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSource('youtube')}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                source === 'youtube'
                  ? 'border-blue-400/50 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-blue-200/60 hover:bg-white/10'
              )}
            >
              <Link2 size={15} />
              Lien YouTube
            </button>
            <button
              type="button"
              onClick={() => setSource('fichier')}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                source === 'fichier'
                  ? 'border-blue-400/50 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-blue-200/60 hover:bg-white/10'
              )}
            >
              <UploadCloud size={15} />
              Importer un fichier
            </button>
          </div>
        </div>

        {source === 'youtube' ? (
          <Input
            id="urlYoutube"
            label="URL YouTube"
            placeholder="https://www.youtube.com/watch?v=..."
            value={urlYoutube}
            onChange={(e) => setUrlYoutube(e.target.value)}
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-blue-100/80">Fichier vidéo</span>
            <input
              ref={fileInputRef}
              id="fichierVideo"
              type="file"
              accept="video/*"
              onChange={handleFichierChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-blue-200/60 hover:border-blue-400/40 hover:text-blue-200 hover:bg-blue-500/5 transition-colors"
            >
              <FileVideo size={18} className="shrink-0" />
              <span className="truncate">
                {fichierVideo
                  ? fichierVideo.name
                  : videoExistante && !estUrlYoutube(videoExistante.url_video)
                    ? 'Remplacer le fichier existant'
                    : 'Depuis votre téléphone ou ordinateur'}
              </span>
            </button>
            <p className="text-[11px] text-blue-200/40">
              Privilégiez YouTube pour les vidéos longues (cultes entiers) — l&apos;import direct convient
              mieux aux extraits courts.
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full">
          {videoExistante ? 'Enregistrer les modifications' : 'Publier la vidéo'}
        </Button>
      </form>
    </div>
  )
}
