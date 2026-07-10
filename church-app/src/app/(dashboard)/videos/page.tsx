import { createClient } from '@/lib/supabase/server'
import { PlayCircle, Calendar } from 'lucide-react'
import { estUrlYoutube } from '@/lib/utils'
import type { VideoMotivation } from '@/types'

export default async function VideosPage() {
  const supabase = await createClient()

  const { data: videos } = await supabase
    .from('videos_motivation')
    .select('*')
    .order('date_creation', { ascending: false })
    .returns<VideoMotivation[]>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Vidéothèque</h1>
        <p className="text-sm text-blue-200/60 mt-1">Des messages de motivation pour avancer dans la foi</p>
      </div>

      {!videos || videos.length === 0 ? (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center">
          <p className="text-sm text-blue-200/50">Aucune vidéo disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video) => {
            const estYoutube = estUrlYoutube(video.url_video)
            return (
              <div
                key={video.id}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 group"
              >
                {estYoutube ? (
                  <a
                    href={video.url_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video bg-linear-to-br from-blue-950 to-black flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[18px_18px]" />
                    <PlayCircle
                      size={40}
                      className="relative text-blue-200/70 group-hover:text-white group-hover:scale-110 transition-all"
                    />
                  </a>
                ) : (
                  <video
                    src={video.url_video}
                    controls
                    preload="metadata"
                    className="aspect-video w-full bg-black"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm">{video.titre}</h3>
                  {video.description && (
                    <p className="text-xs text-blue-200/60 mt-1 line-clamp-2">{video.description}</p>
                  )}
                  <p className="text-xs text-blue-200/50 mt-2 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(video.date_creation).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
