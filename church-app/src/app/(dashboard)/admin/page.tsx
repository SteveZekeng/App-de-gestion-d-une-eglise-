import { createClient } from '@/lib/supabase/server'
import StatCard from '@/components/ui/StatCard'
import Donut from '@/components/ui/Donut'
import BarList from '@/components/ui/BarList'
import {
  Users,
  Heart,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  PlayCircle,
  BookOpen,
  Radio,
  CalendarClock,
  FileCode2,
} from 'lucide-react'

// Le rôle (admin/pasteur) est déjà vérifié par le layout parent (admin/layout.tsx).
export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: nbUtilisateurs },
    { count: nbFideles },
    { count: nbIntentionsEnAttente },
    { count: nbIntentionsTraitees },
    { count: nbParticipations },
    { count: nbVideos },
    { count: nbPensees },
    { count: nbLivesCumules },
    { count: nbSessionsPlanifiees },
    { data: liveEnCours },
    { data: participationsDistinctes },
  ] = await Promise.all([
    supabase.from('utilisateurs').select('*', { count: 'exact', head: true }),
    supabase.from('utilisateurs').select('*', { count: 'exact', head: true }).eq('est_actif', true),
    supabase.from('intentions').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    supabase.from('intentions').select('*', { count: 'exact', head: true }).eq('statut', 'traitee'),
    supabase.from('participations').select('*', { count: 'exact', head: true }),
    supabase.from('videos_motivation').select('*', { count: 'exact', head: true }),
    supabase.from('pensees_du_jour').select('*', { count: 'exact', head: true }),
    supabase.from('prieres').select('*', { count: 'exact', head: true }).eq('type', 'live'),
    supabase.from('prieres').select('*', { count: 'exact', head: true }).eq('statut', 'planifie'),
    supabase.from('prieres').select('id, titre').eq('statut', 'en_cours').limit(1).maybeSingle(),
    supabase.from('participations').select('user_id'),
  ])

  const nbFidelesEngages = new Set(participationsDistinctes?.map((p) => p.user_id)).size

  let nbParticipantsLive = 0
  if (liveEnCours) {
    const { count } = await supabase
      .from('participations')
      .select('*', { count: 'exact', head: true })
      .eq('priere_id', liveEnCours.id)
    nbParticipantsLive = count ?? 0
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/5 text-blue-300 flex items-center justify-center shrink-0">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Vue d&apos;ensemble</h1>
          <p className="text-sm text-blue-200/60 mt-1">Statistiques de la communauté</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Fidèles actifs" value={nbFideles ?? 0} icon={Users} color="blue" />
        <StatCard label="Intentions en attente" value={nbIntentionsEnAttente ?? 0} icon={Clock} color="amber" />
        <StatCard label="Intentions traitées" value={nbIntentionsTraitees ?? 0} icon={CheckCircle2} color="emerald" />
        <StatCard label="Participations totales" value={nbParticipations ?? 0} icon={Heart} color="rose" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BarList
          titre="Contenu publié"
          items={[
            { label: 'Vidéos', value: nbVideos ?? 0, icon: PlayCircle, color: '#60a5fa' },
            { label: 'Pensées du jour', value: nbPensees ?? 0, icon: BookOpen, color: '#34d399' },
            { label: 'Lives cumulés', value: nbLivesCumules ?? 0, icon: Radio, color: '#f87171' },
            { label: 'Sessions planifiées', value: nbSessionsPlanifiees ?? 0, icon: CalendarClock, color: '#fbbf24' },
          ]}
        />

        <div className="flex flex-col gap-4">
          <Donut
            label="Fidèles actifs"
            value={nbFideles ?? 0}
            total={nbUtilisateurs ?? 0}
            color="#3b82f6"
            sousTexte="Comptes non désactivés"
          />
          <Donut
            label="Déjà participé à un live"
            value={nbFidelesEngages}
            total={nbUtilisateurs ?? 0}
            color="#34d399"
            sousTexte="Au moins une participation enregistrée"
          />
        </div>
      </div>

      <div
        className={`rounded-2xl border p-5 flex items-center gap-4 ${
          liveEnCours ? 'bg-red-500/10 border-red-400/30' : 'bg-white/5 border-white/10'
        }`}
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            liveEnCours ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-blue-200/50'
          }`}
        >
          <Radio size={20} className={liveEnCours ? 'animate-pulse' : ''} />
        </div>
        <div>
          {liveEnCours ? (
            <>
              <p className="text-sm font-medium text-white">
                Live en cours — <span className="text-red-300">{liveEnCours.titre}</span>
              </p>
              <p className="text-xs text-blue-200/60 mt-0.5">
                {nbParticipantsLive} fidèle{nbParticipantsLive === 1 ? '' : 's'} connecté
                {nbParticipantsLive === 1 ? '' : 's'} en ce moment
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white">Aucun live en cours</p>
              <p className="text-xs text-blue-200/60 mt-0.5">
                Démarrez-en un depuis la page Prières
              </p>
            </>
          )}
        </div>
      </div>

      <a
        href="/api-docs.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-blue-200/40 hover:text-blue-200/70 transition-colors w-fit"
      >
        <FileCode2 size={13} />
        Documentation API (Swagger)
      </a>
    </div>
  )
}
