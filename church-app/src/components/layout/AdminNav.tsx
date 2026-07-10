'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, PlayCircle, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'

export default function AdminNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  const links = [
    { href: '/admin', label: t('admin_vue_ensemble'), icon: LayoutDashboard },
    { href: '/admin/prieres', label: t('nav_prieres'), icon: Calendar },
    { href: '/admin/videos', label: t('admin_predications'), icon: PlayCircle },
    { href: '/admin/pensees', label: t('admin_pensee'), icon: BookOpen },
    { href: '/admin/utilisateurs', label: t('admin_utilisateurs'), icon: Users },
  ]

  return (
    <nav className="flex gap-1 bg-blue-900/4 dark:bg-white/5 rounded-xl border border-blue-900/10 dark:border-white/10 p-1 w-full sm:w-fit overflow-x-auto scrollbar-none">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.href === '/admin' ? pathname === link.href : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap',
              isActive
                ? 'text-foreground bg-blue-900/6 dark:bg-white/10'
                : 'text-blue-700/70 dark:text-blue-200/70 hover:text-foreground hover:bg-blue-900/6 dark:hover:bg-white/10'
            )}
          >
            <Icon size={14} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
