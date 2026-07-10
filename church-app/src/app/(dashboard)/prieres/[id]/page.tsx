import { createClient } from '@/lib/supabase/server'
import { getAuthUser, getProfil } from '@/lib/supabase/auth'
import { notFound } from 'next/navigation'
import VideoPlayer from '@/components/ui/VideoPlayer'
import LiveInteractions from '@/components/prieres/LiveInteractions'
import type { Priere, Participation } from '@/types'

export default async function PriereDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: priere } = await supabase
    .from('prieres')
    .select('*')
    .eq('id', id)
    .single<Priere>()

  if (!priere || !priere.url_video) {
    notFound()
  }

  const authUser = await getAuthUser()

  if (!authUser) {
    notFound()
  }

  const { data: participation } = await supabase
    .from('participations')
    .select('*')
    .eq('user_id', authUser.id)
    .eq('priere_id', id)
    .maybeSingle<Participation>()

  const positionDepart = participation?.position_reprise_sec ?? 0
  const profil = await getProfil()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-xl font-bold text-white">{priere.titre}</h1>
        {priere.description && (
          <p className="text-sm text-blue-200/60 mt-1">{priere.description}</p>
        )}
      </div>

      <VideoPlayer
        priereId={priere.id}
        userId={authUser.id}
        urlVideo={priere.url_video}
        positionDepart={positionDepart}
      />

      {profil && (
        <LiveInteractions priereId={priere.id} userId={profil.id} nom={profil.nom} prenom={profil.prenom} />
      )}
    </div>
  )
}