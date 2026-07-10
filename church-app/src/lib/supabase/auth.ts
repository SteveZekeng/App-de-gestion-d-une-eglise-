import { cache } from 'react'
import { createClient } from './server'
import type { Utilisateur } from '@/types'

// cache() mémoïse le résultat pour la durée de la requête : layout, layout
// imbriqué et page peuvent tous appeler ces fonctions sans multiplier les
// appels réseau vers Supabase (getUser fait un vrai aller-retour réseau).
export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
})

export const getProfil = cache(async () => {
  const authUser = await getAuthUser()
  if (!authUser) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('id', authUser.id)
    .single<Utilisateur>()

  return data
})
