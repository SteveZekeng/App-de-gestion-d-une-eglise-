'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'
import NotificationBell from './NotificationBell'
import type { Utilisateur } from '@/types'

export default function Navbar({ user }: { user: Utilisateur }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLocale()
  const peutAdministrer = user.role === 'admin' || user.role === 'pasteur'

  const links = [
    { href: '/dashboard', label: t('nav_dashboard') },
    { href: '/prieres', label: t('nav_prieres') },
    { href: '/videos', label: t('nav_videos') },
    { href: '/dashboard/intentions', label: t('nav_intentions') },
  ]
  const navLinks = peutAdministrer ? [...links, { href: '/admin', label: t('nav_admin') }] : links

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <Image src="/logoChurch.png" alt="CIV" width={36} height={36} className="rounded-lg" />
          <span className="font-display hidden lg:inline text-sm tracking-wide text-foreground uppercase">
            Centre International des Vainqueurs
          </span>
        </div>

        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/dashboard'
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-foreground bg-blue-900/6 dark:bg-white/10'
                    : 'text-blue-700/70 dark:text-blue-200/70 hover:text-foreground hover:bg-blue-900/5 dark:hover:bg-white/5'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.25 h-0.5 w-5 rounded-full bg-linear-to-r from-blue-400 to-blue-600" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/parametres"
            className="p-2 rounded-lg text-blue-700/70 dark:text-blue-200/70 hover:text-foreground hover:bg-blue-900/6 dark:hover:bg-white/10 transition-colors"
            title={t('nav_parametres')}
          >
            <Settings size={18} />
          </Link>
          <NotificationBell userId={user.id} />

          <div className="text-right hidden sm:block ml-2">
            <p className="text-sm font-medium text-foreground">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-blue-700/60 dark:text-blue-200/60 capitalize">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-blue-700/70 dark:text-blue-200/70 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-blue-900/5 dark:hover:bg-white/5"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t('deconnexion')}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
