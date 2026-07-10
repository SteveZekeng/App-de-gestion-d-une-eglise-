import type { EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Route appelée depuis les liens envoyés par email par Supabase (recovery,
// confirmation d'inscription...). @supabase/ssr force le flow PKCE côté
// client, incompatible avec les liens à fragment `#access_token=` ; ce
// endpoint vérifie le `token_hash` côté serveur (verifyOtp) et établit la
// session via cookies avant de rediriger vers la page finale.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?erreur=lien_invalide`)
}
