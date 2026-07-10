import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Créer le profil si c'est la première connexion Google
      const { data: profil } = await supabase
        .from('utilisateurs')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!profil) {
        const meta = data.user.user_metadata ?? {}
        await supabase.from('utilisateurs').insert({
          id: data.user.id,
          nom: meta.family_name ?? meta.last_name ?? (meta.full_name ?? '').split(' ').slice(1).join(' ') ?? '',
          prenom: meta.given_name ?? meta.first_name ?? (meta.full_name ?? '').split(' ')[0] ?? '',
          email: data.user.email,
          role: 'fidele',
        })
        return NextResponse.redirect(new URL('/dashboard', origin))
      }

      const destination = profil.role === 'admin' || profil.role === 'pasteur' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(destination, origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
}
