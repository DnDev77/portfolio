"use client"

import { useLocale } from "@/hooks/useLocale"
import { LocaleContext, translations } from "@/context/localeContext"
import type { ReactNode } from "react"

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale, toggleLocale, mounted } = useLocale()

  const t = translations[locale]

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t, mounted }}>
      {children}
    </LocaleContext.Provider>
  )
}