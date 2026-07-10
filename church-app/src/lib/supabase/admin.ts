import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client "service_role" — contourne RLS, à n'utiliser que côté serveur
// (route handlers, server actions). Ne jamais importer ce fichier depuis
// un composant client ('use client').
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
