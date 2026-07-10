'use client'

import { Settings, Languages } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import type { Locale } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

export default function ParametresPage() {
  const { locale, setLocale, t } = useLocale()

  const optionsLangue: { value: Locale; label: string }[] = [
    { value: 'fr', label: t('langue_francais') },
    { value: 'en', label: t('langue_anglais') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/5 text-blue-300 flex items-center justify-center shrink-0">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t('parametres_titre')}</h1>
          <p className="text-sm text-blue-700/70 dark:text-blue-200/60 mt-1">{t('parametres_sous_titre')}</p>
        </div>
      </div>

      <div className="bg-blue-900/4 dark:bg-white/5 rounded-2xl border border-blue-900/10 dark:border-white/10 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Languages size={15} />
          {t('langue')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {optionsLangue.map((option) => {
            const estActif = locale === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocale(option.value)}
                className={cn(
                  'rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  estActif
                    ? 'border-blue-400/50 bg-blue-500/10 text-foreground'
                    : 'border-blue-900/10 dark:border-white/10 bg-blue-900/4 dark:bg-white/5 text-blue-700/70 dark:text-blue-200/60 hover:bg-blue-900/6 dark:hover:bg-white/10'
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
