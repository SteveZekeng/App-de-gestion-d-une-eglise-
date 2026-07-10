'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MailCheck } from 'lucide-react'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [emailEnvoye, setEmailEnvoye] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Indiquez votre email.')
      return
    }

    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    })

    setIsLoading(false)

    if (error) {
      setError("Une erreur est survenue, réessayez.")
      return
    }

    // Toujours afficher un succès, même si l'email n'existe pas
    // (évite de révéler quels emails sont enregistrés).
    setEmailEnvoye(true)
  }

  if (emailEnvoye) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
          <MailCheck size={22} className="text-blue-300" />
        </div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Vérifiez vos emails</h2>
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60">
          Si un compte existe pour <span className="text-foreground font-medium">{email}</span>, un lien de
          réinitialisation vient de lui être envoyé.
        </p>
        <Link href="/login" className="inline-block mt-6 text-sm text-blue-400 font-medium hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-1">Mot de passe oublié</h2>
      <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mb-6">
        Indiquez votre email, nous vous enverrons un lien pour le réinitialiser.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Envoyer le lien
        </Button>
      </form>

      <p className="text-center text-sm text-blue-700/70 dark:text-blue-200/60 mt-6">
        <Link href="/login" className="text-blue-400 font-medium hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </>
  )
}
