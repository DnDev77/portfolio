"use client"

import { useState, useEffect } from "react"

export type Locale = "pt-BR" | "en-US"

const STORAGE_KEY = "portfolio-locale"

/**
 * Descobre automaticamente qual idioma usar:
 * 1. primeiro, vê se você já escolheu um idioma antes e salvou no navegador
 * 2. se não tiver salvo, usa o idioma padrão do seu navegador
 * 3. se nada disso funcionar, usa inglês como padrão
 */

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en-US"

  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved === "pt-BR" || saved === "en-US") return saved

  const browserLang = navigator.language || ""

  if (browserLang.toLowerCase().startsWith("pt")) return "pt-BR"

  return "en-US"
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en-US")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(detectLocale())
    setMounted(true)
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")
  }

  return { locale, setLocale, toggleLocale, mounted }
}