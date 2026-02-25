'use client'
import { useState, useEffect } from "react"

export function useScramble(text: string, active: boolean) {
  const [display, setDisplay] = useState(text)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"

  useEffect(() => {
    if (!active) { setDisplay(text); return }
    let frame = 0
    const total = 12
    const interval = setInterval(() => {
      frame++
      if (frame >= total) { setDisplay(text); clearInterval(interval); return }
      setDisplay(
        text.split("").map((c, i) => {
          if (i < Math.floor((frame / total) * text.length)) return c
          return c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      )
    }, 40)
    return () => clearInterval(interval)
  }, [active, text])

  return display
}