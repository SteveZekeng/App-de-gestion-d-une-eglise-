'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import FormulaireVideo from '@/components/admin/FormulaireVideo'
import { Plus, Pencil, Trash2, PlayCircle } from 'lucide-react'
import type { VideoMotivation } from '@/types'

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoMotivation[]>([])
  const [userId, setUserId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [videoEdition, setVideoEdition] = useState<VideoMotivation | undefined>()
  const [error, setError] = useState('')

  async function fetchVideos() {
    const supabase = createClient()
    const { data } = await supabase
      .from('videos_motivation')
      .select('*')
      .order('date_creation', { ascending: false })
      .returns<VideoMotivation[]>()
    setVideos(data ?? [])
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
    fetchVideos()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette vidéo ?')) return
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('videos_motivation').delete().eq('id', id)
    if (error) {
      setError('La suppression a échoué : ' + error.message)
      return
    }
    fetchVideos()
  }

  function openCreate() {
    setVideoEdition(undefined)
    setShowForm(true)
  }

  function openEdit(video: VideoMotivation) {
    setVideoEdition(video)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    fetchVideos()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Publier une vidéo</h1>
          <p className="text-sm text-blue-200/60 mt-1">
            Culte d&apos;enseignement, veillée de prières, camps spirituels, retraite spirituelle...
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus size={16} />
          Nouvelle vidéo
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        {videos.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <PlayCircle size={20} className="text-blue-200/50" />
            </div>
            <p className="text-sm text-blue-200/50">Aucune vidéo publiée pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-blue-200/50">
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-white flex items-center gap-2">
                    <PlayCircle size={14} className="text-blue-300/70" />
                    {video.titre}
                  </td>
                  <td className="px-5 py-3 text-blue-200/60">
                    {new Date(video.date_creation).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(video)}
                        className="p-1.5 text-blue-200/50 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1.5 text-blue-200/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showForm && (
        <FormulaireVideo userId={userId} videoExistante={videoEdition} onClose={closeForm} />
      )}
    </div>
  )
}
