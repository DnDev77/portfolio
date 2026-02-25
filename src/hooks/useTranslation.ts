import { LocaleContext } from "@/context/localeContext"
import { useContext } from "react"

export function useTranslation() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LocaleProvider>")
  }
  return ctx
}