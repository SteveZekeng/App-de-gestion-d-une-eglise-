'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CheckCircle2 } from 'lucide-react'

// On utilise ici le client @supabase/supabase-js standard (pas @supabase/ssr)
// car il détecte automatiquement le fragment #access_token=...&type=recovery
// dans l'URL et déclenche l'événement PASSWORD_RECOVERY.
// Le client @supabase/ssr force le flow PKCE et ignore ces fragments.
function creerClientStandard() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function ReinitialiserMotDePassePage() {
  const router = useRouter()
  const [lienValide, setLienValide] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [succes, setSucces] = useState(false)

  useEffect(() => {
    const supabase = creerClientStandard()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setLienValide(true)
      }
    })

    // Cas où la session est déjà active à l'arrivée sur la page
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setLienValide((v) => v ?? true)
    })

    // Délai de sécurité : si après 3s rien n'est détecté, le lien est invalide
    const timeout = setTimeout(() => {
      setLienValide((v) => v ?? false)
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)
    setError('')

    const supabase = creerClientStandard()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError("Une erreur est survenue, réessayez.")
      setIsLoading(false)
      return
    }

    setSucces(true)
    setIsLoading(false)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (lienValide === null) {
    return (
      <div className="text-center">
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60">Vérification du lien...</p>
      </div>
    )
  }

  if (!lienValide) {
    return (
      <div className="text-center">
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Lien invalide ou expiré</h2>
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mb-6">
          Demandez un nouveau lien de réinitialisation.
        </p>
        <Link
          href="/mot-de-passe-oublie"
          className="inline-block text-sm text-blue-400 font-medium hover:underline"
        >
          Mot de passe oublié
        </Link>
      </div>
    )
  }

  if (succes) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={22} className="text-emerald-300" />
        </div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Mot de passe modifié</h2>
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60">Redirection vers la connexion...</p>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-1">Nouveau mot de passe</h2>
      <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mb-6">Choisissez un nouveau mot de passe.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="password"
          label="Nouveau mot de passe"
          type="password"
          placeholder="Minimum 6 caractères"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          id="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Minimum 6 caractères"
          minLength={6}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Réinitialiser le mot de passe
        </Button>
      </form>
    </>
  )
}
