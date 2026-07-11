'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import BoutonGoogle from '@/components/ui/BoutonGoogle'
import BoutonFacebook from '@/components/ui/BoutonFacebook'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.SubmitEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      setError('Email ou mot de passe incorrect.')
      setIsLoading(false)
      return
    }

    const { data: profil } = await supabase
      .from('utilisateurs')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const destination = profil?.role === 'admin' || profil?.role === 'pasteur' ? '/admin' : '/dashboard'

    router.push(destination)
    router.refresh()
  }

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-1">Connexion</h2>
      <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mb-6">Bon retour parmi nous 👋</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link
            href="/mot-de-passe-oublie"
            className="self-end text-xs text-blue-400 font-medium hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Se connecter
        </Button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-blue-200/40">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="flex flex-col gap-2">
        <BoutonGoogle />
        <BoutonFacebook />
      </div>

      <p className="text-center text-sm text-blue-700/70 dark:text-blue-200/60 mt-6">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-blue-400 font-medium hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </>
  )
}