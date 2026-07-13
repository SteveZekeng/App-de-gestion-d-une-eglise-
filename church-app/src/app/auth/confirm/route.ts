import type { EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const code = searchParams.get('code')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  // Cas 1 : PKCE email OTP direct (token_hash dans l'URL)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      const destination = type === 'recovery' ? '/reinitialiser-mot-de-passe' : next
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  // Cas 2 : code OAuth (PKCE exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const destination = type === 'recovery' ? '/reinitialiser-mot-de-passe' : (next || '/dashboard')
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  // Cas 3 : session déjà établie par Supabase (cookies posés par le verify endpoint)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const isRecovery = type === 'recovery' || next === '/reinitialiser-mot-de-passe'
    const destination = isRecovery ? '/reinitialiser-mot-de-passe' : (next || '/dashboard')
    return NextResponse.redirect(`${origin}${destination}`)
  }

  return NextResponse.redirect(`${origin}/login?erreur=lien_invalide`)
}
