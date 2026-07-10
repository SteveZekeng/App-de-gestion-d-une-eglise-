'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Locale } from '@/lib/i18n/translations'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (cle: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => {
    const stocke = (localStorage.getItem('locale') as Locale) || 'fr'
    setLocaleState(stocke)
  }, [])

  function setLocale(nouvelleLocale: Locale) {
    localStorage.setItem('locale', nouvelleLocale)
    setLocaleState(nouvelleLocale)
  }

  function t(cle: string) {
    return translations[locale]?.[cle] ?? translations.fr[cle] ?? cle
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale doit être utilisé dans un LocaleProvider')
  return ctx
}
