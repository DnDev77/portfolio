"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import gsap from "gsap"

const CHARS = "!@#$%^&*()_+-=<>?/\\[]{}Xx"

function animate(
  target: string,
  duration: number,
  update: (text: string) => void,
  done?: () => void,
): gsap.core.Tween {
  const locked = new Set<number>()
  const final = target.split("")
  const obj = { p: 0 }

  return gsap.to(obj, {
    p: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const n = Math.floor(obj.p * final.length)
      for (let i = 0; i < n; i++) locked.add(i)
      update(final.map((c, i) => (locked.has(i) ? c : CHARS[Math.floor(Math.random() * CHARS.length)])).join(""))
    },
    onComplete: () => {
      update(target)
      done?.()
    },
  })
}

function scramble(text: string): string {
  return text.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
}

interface ScrambleTextProps {
  text: string
  className?: string
  delayMs?: number
  duration?: number
}

export function ScrambleText({ text, className, delayMs = 0, duration = 0.9 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const [done, setDone] = useState(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (done || !text) return

    setDisplay(scramble(text))

    timerRef.current = setTimeout(() => {
      tweenRef.current = animate(text, duration, setDisplay, () => setDone(true))
    }, delayMs)

    return () => {
      timerRef.current && clearTimeout(timerRef.current)
      tweenRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (done && display !== text) setDisplay(text)
  }, [text, done, display])

  return <span className={className}>{display || text}</span>
}

interface ScrambleTextOnHoverProps {
  text: string
  className?: string
  duration?: number
  as?: "span" | "button" | "div"
  onClick?: () => void
}

export function ScrambleTextOnHover({
  text,
  className,
  duration = 0.4,
  as: Tag = "span",
  onClick,
}: ScrambleTextOnHoverProps) {
  const [display, setDisplay] = useState(text)
  const running = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const onEnter = useCallback(() => {
    if (running.current) return
    running.current = true
    tweenRef.current?.kill()
    setDisplay(scramble(text))
    tweenRef.current = animate(text, duration, setDisplay, () => {
      running.current = false
    })
  }, [text, duration])

  useEffect(() => {
    if (!running.current) setDisplay(text)
  }, [text])

  return (
    <Tag className={className} onMouseEnter={onEnter} onClick={onClick}>
      {display}
    </Tag>
  )
}