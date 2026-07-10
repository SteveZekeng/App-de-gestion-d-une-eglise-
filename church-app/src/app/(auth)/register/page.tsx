'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MailCheck } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationEnvoyee, setConfirmationEnvoyee] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  async function handleRegister(e: React.SubmitEvent) {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { nom: form.nom, prenom: form.prenom }
      }
    })

    if (error) {
      setError("Impossible de créer le compte. Vérifiez vos informations et réessayez.")
      setIsLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('utilisateurs').insert({
        id: data.user.id,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        role: 'fidele',
      })
    }

    setIsLoading(false)

    if (data.session) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setConfirmationEnvoyee(true)
    }
  }

  if (confirmationEnvoyee) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
          <MailCheck size={22} className="text-blue-300" />
        </div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Vérifiez vos emails</h2>
        <p className="text-sm text-blue-700/70 dark:text-blue-200/60">
          Un lien de confirmation a été envoyé à{' '}
          <span className="text-foreground font-medium">{form.email}</span>.
          Cliquez dessus pour activer votre compte.
        </p>
        <Link href="/login" className="inline-block mt-6 text-sm text-blue-400 font-medium hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-1">Créer un compte</h2>
      <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mb-6">Rejoins la communauté 🙌</p>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input id="prenom" label="Prénom" placeholder="Jean" value={form.prenom} onChange={handleChange} />
          <Input id="nom" label="Nom" placeholder="Dupont" value={form.nom} onChange={handleChange} />
        </div>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="Minimum 6 caractères"
          minLength={6}
          required
          value={form.password}
          onChange={handleChange}
        />
        <Input
          id="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Minimum 6 caractères"
          minLength={6}
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && (
          <p className="text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-blue-700/70 dark:text-blue-200/60 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-blue-400 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  )
}