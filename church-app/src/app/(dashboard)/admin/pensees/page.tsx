import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/auth'
import FormulairePensee from '@/components/admin/FormulairePensee'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import type { PenseeDuJour } from '@/types'

export default async function AdminPenseesPage() {
  const authUser = await getAuthUser()
  if (!authUser) return null

  const supabase = await createClient()
  const { data: pensees } = await supabase
    .from('pensees_du_jour')
    .select('*')
    .order('date_creation', { ascending: false })
    .returns<PenseeDuJour[]>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Pensée du jour</h1>
        <p className="text-sm text-blue-200/60 mt-1">
          La dernière pensée publiée s&apos;affiche sur le tableau de bord de tous les fidèles
        </p>
      </div>

      <FormulairePensee userId={authUser.id} />

      <div className="flex flex-col gap-2">
        {!pensees || pensees.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center">
            <p className="text-sm text-blue-200/50">Aucune pensée publiée pour le moment</p>
          </div>
        ) : (
          pensees.map((pensee, index) => (
            <div
              key={pensee.id}
              className={`rounded-2xl border overflow-hidden flex gap-3 ${
                index === 0
                  ? 'bg-blue-500/10 border-blue-400/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="relative w-24 h-24 shrink-0 bg-black">
                <Image src={pensee.image_url} alt="" fill className="object-cover" />
              </div>
              <div className="py-3 pr-4 flex-1 min-w-0">
                {index === 0 && (
                  <p className="text-[11px] font-medium text-blue-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <BookOpen size={11} />
                    Actuellement affichée
                  </p>
                )}
                {pensee.reference_biblique && (
                  <p className="text-sm font-medium text-white">{pensee.reference_biblique}</p>
                )}
                <p className="text-[11px] text-blue-200/40 mt-1">
                  {new Date(pensee.date_creation).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
