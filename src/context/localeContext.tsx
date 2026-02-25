"use client"

import { createContext, useContext } from "react"
import { type Locale } from "@/hooks/useLocale"
import ptBR from "@/data/locales/pt-br.json"
import enUS from "@/data/locales/en-us.json"

type Translations = typeof ptBR

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: Translations
  mounted: boolean
}

// context 

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export const translations: Record<Locale, Translations> = {
  "pt-BR": ptBR,
  "en-US": enUS,
}