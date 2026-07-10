'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VideoPlayerProps {
  priereId: string
  userId: string
  urlVideo: string
  positionDepart: number
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return match ? match[1] : ''
}

export default function VideoPlayer({
  priereId,
  userId,
  urlVideo,
  positionDepart,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [hasResumed, setHasResumed] = useState(positionDepart > 0)
  const videoId = extractYoutubeId(urlVideo)

  // Sauvegarde la position toutes les 10 secondes
  useEffect(() => {
    const supabase = createClient()
    let currentPosition = positionDepart

    // Note : l'API YouTube iframe ne permet pas de lire le temps facilement
    // sans le SDK JS officiel. On simule ici une sauvegarde périodique
    // basée sur le temps écoulé depuis l'ouverture (approche simple pour le MVP).
    const startTime = Date.now()
    const baseTime = positionDepart

    const interval = setInterval(async () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000)
      currentPosition = baseTime + elapsedSec

      await supabase.from('participations').upsert(
        {
          user_id: userId,
          priere_id: priereId,
          position_reprise_sec: currentPosition,
          duree_visionnage_sec: currentPosition,
          date_participation: new Date().toISOString(),
        },
        { onConflict: 'user_id,priere_id' }
      )
    }, 10000) // toutes les 10 secondes

    return () => clearInterval(interval)
  }, [priereId, userId, positionDepart])

  const startParam = positionDepart > 0 ? `&start=${positionDepart}` : ''

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video bg-black rounded-2xl overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0${startParam}`}
          title="Lecteur de prière"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      {hasResumed && (
        <p className="text-xs text-blue-200 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 inline-flex items-center gap-1.5 w-fit">
          ▶️ Reprise à {Math.floor(positionDepart / 60)}min {positionDepart % 60}s
        </p>
      )}
    </div>
  )
}