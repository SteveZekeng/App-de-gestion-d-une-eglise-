import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlayCircle, Calendar } from 'lucide-react'
import type { Priere } from '@/types'

export default async function PrieresPage() {
  const supabase = await createClient()

  const { data: rediffusions } = await supabase
    .from('prieres')
    .select('*')
    .eq('statut', 'termine')
    .order('date_debut', { ascending: false })
    .returns<Priere[]>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Rediffusions</h1>
        <p className="text-sm text-blue-200/60 mt-1">Revivez les moments de prière passés</p>
      </div>

      {!rediffusions || rediffusions.length === 0 ? (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center">
          <p className="text-sm text-blue-200/50">Aucune rediffusion disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rediffusions.map((priere) => (
            <Link
              key={priere.id}
              href={`/prieres/${priere.id}`}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/40 transition-colors group"
            >
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <PlayCircle
                  size={40}
                  className="text-blue-200/70 group-hover:text-white group-hover:scale-110 transition-all"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white text-sm">{priere.titre}</h3>
                {priere.description && (
                  <p className="text-xs text-blue-200/60 mt-1 line-clamp-2">{priere.description}</p>
                )}
                {priere.date_debut && (
                  <p className="text-xs text-blue-200/50 mt-2 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(priere.date_debut).toLocaleDateString('fr-FR', {
                      dateStyle: 'medium',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}