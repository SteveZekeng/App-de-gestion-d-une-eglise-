import { createClient } from '@/lib/supabase/server'
import { getProfil } from '@/lib/supabase/auth'
import { Play, Calendar } from 'lucide-react'
import CartePenseeDuJour from '@/components/dashboard/CartePenseeDuJour'
import LiveInteractions from '@/components/prieres/LiveInteractions'
import type { Priere, PenseeDuJour } from '@/types'

const YOUTUBE_HOSTS = ['www.youtube.com', 'youtube.com', 'youtu.be']

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (!YOUTUBE_HOSTS.includes(u.hostname)) return null
    return url.replace('watch?v=', 'embed/')
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const profil = await getProfil()

  const { data: priereEnCours } = await supabase
    .from('prieres')
    .select('*')
    .eq('statut', 'en_cours')
    .order('date_debut', { ascending: false })
    .limit(1)
    .maybeSingle<Priere>()

  const { data: prochainesSessions } = await supabase
    .from('prieres')
    .select('*')
    .eq('statut', 'planifie')
    .order('date_debut', { ascending: true })
    .limit(3)
    .returns<Priere[]>()

  const { data: penseeDuJour } = await supabase
    .from('pensees_du_jour')
    .select('*')
    .order('date_creation', { ascending: false })
    .limit(1)
    .maybeSingle<PenseeDuJour>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mt-1">Bienvenue dans votre espace de prière</p>
      </div>

      {/* Pensée du jour */}
      {penseeDuJour && <CartePenseeDuJour pensee={penseeDuJour} />}

      {/* Session live en cours */}
      {priereEnCours ? (
        <div className="bg-blue-900/4 dark:bg-white/5 rounded-2xl border border-blue-900/10 dark:border-white/10 overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            {priereEnCours.url_video && getYoutubeEmbedUrl(priereEnCours.url_video) ? (
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(priereEnCours.url_video)!}
                title={priereEnCours.titre}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <p className="text-blue-200/50 text-sm">Vidéo en cours de préparation...</p>
            )}
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              EN DIRECT
            </span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="font-semibold text-foreground">{priereEnCours.titre}</h2>
              {priereEnCours.description && (
                <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mt-1">{priereEnCours.description}</p>
              )}
            </div>
            {profil && (
              <LiveInteractions
                priereId={priereEnCours.id}
                userId={profil.id}
                nom={profil.nom}
                prenom={profil.prenom}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-blue-900/4 dark:bg-white/5 rounded-2xl border border-blue-900/10 dark:border-white/10 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-900/6 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Play size={20} className="text-blue-700/60 dark:text-blue-200/50" />
          </div>
          <p className="text-sm font-medium text-foreground">Aucun direct en ce moment</p>
          <p className="text-xs text-blue-700/60 dark:text-blue-200/50 mt-1">Revenez à l&apos;heure de la prochaine session</p>
        </div>
      )}

      {/* Prochaines sessions */}
      {prochainesSessions && prochainesSessions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Calendar size={15} />
            Prochaines sessions
          </h3>
          <div className="flex flex-col gap-2">
            {prochainesSessions.map((session) => (
              <div
                key={session.id}
                className="bg-blue-900/4 dark:bg-white/5 rounded-xl border border-blue-900/10 dark:border-white/10 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{session.titre}</p>
                  {session.date_debut && (
                    <p className="text-xs text-blue-700/60 dark:text-blue-200/50 mt-0.5">
                      {new Date(session.date_debut).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}