import { createClient } from '@/lib/supabase/server'
import { getAuthUser, getProfil } from '@/lib/supabase/auth'
import FormulaireIntention from '@/components/intentions/FormulaireIntention'
import CarteIntention from '@/components/intentions/CarteIntention'
import type { Intention, ReponseIntention } from '@/types'

export default async function IntentionsPage() {
  const supabase = await createClient()
  const authUser = await getAuthUser()

  if (!authUser) return null

  const profil = await getProfil()
  const peutRepondre = profil?.role === 'pasteur' || profil?.role === 'admin'

  // Pasteur/admin voit tout, fidèle voit les siennes (la RLS filtre déjà,
  // mais on filtre explicitement côté fidèle pour la query)
  const query = supabase
    .from('intentions')
    .select('*')
    .order('date_creation', { ascending: false })

  const { data: intentions } = await query.returns<Intention[]>()

  const { data: toutesReponses } = await supabase
    .from('reponses_intention')
    .select('*')
    .returns<ReponseIntention[]>()

  function getReponses(intentionId: string) {
    return toutesReponses?.filter((r) => r.intention_id === intentionId) ?? []
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Intentions de prière</h1>
        <p className="text-sm text-blue-200/60 mt-1">
          {peutRepondre
            ? 'Consultez et répondez aux demandes des fidèles'
            : 'Déposez vos demandes et suivez les réponses'}
        </p>
      </div>

      {!peutRepondre && <FormulaireIntention userId={authUser.id} />}

      <div className="flex flex-col gap-3">
        {!intentions || intentions.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center">
            <p className="text-sm text-blue-200/50">Aucune intention pour le moment</p>
          </div>
        ) : (
          intentions.map((intention) => (
            <CarteIntention
              key={intention.id}
              intention={intention}
              reponses={getReponses(intention.id)}
              peutRepondre={peutRepondre}
              responsableId={authUser.id}
            />
          ))
        )}
      </div>
    </div>
  )
}