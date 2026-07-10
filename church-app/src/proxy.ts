import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const estRouteProtegee =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/prieres')

  // Routes protégées — redirige vers /login si non connecté.
  // On distingue les erreurs réseau (pas de status HTTP = fetch échoué) des
  // vraies erreurs auth (JWT expiré, session révoquée…) qui ont un status HTTP.
  // Seules les erreurs réseau transitoires justifient de laisser passer.
  if (!user && estRouteProtegee) {
    const erreurReseau = error && !('status' in error && error.status)
    if (erreurReseau) {
      return supabaseResponse
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si connecté et sur /login → redirige vers son espace selon son rôle
  if (user && pathname === '/login') {
    const { data: profil } = await supabase
      .from('utilisateurs')
      .select('role')
      .eq('id', user.id)
      .single()

    const destination = profil?.role === 'admin' || profil?.role === 'pasteur' ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
