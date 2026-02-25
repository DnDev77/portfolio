"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useMemo, useState, useCallback, useEffect, useRef, createContext, useContext } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface AudioCtx {
  muted: boolean
  toggle: () => void
  tick: () => void
}

const Ctx = createContext<AudioCtx | null>(null)
const useAudio = () => useContext(Ctx)

export function SplitFlapAudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    return ctxRef.current
  }, [])

  const tick = useCallback(() => {
    if (muted) return

    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10)

    try {
      const ctx = getCtx()
      if (!ctx) return
      if (ctx.state === "suspended") ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const bp = ctx.createBiquadFilter()
      const lp = ctx.createBiquadFilter()

      osc.type = "square"
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.015)

      bp.type = "bandpass"
      bp.frequency.setValueAtTime(1200, ctx.currentTime)
      bp.Q.setValueAtTime(0.8, ctx.currentTime)

      lp.type = "lowpass"
      lp.frequency.value = 2500
      lp.Q.value = 0.5

      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

      osc.connect(bp)
      bp.connect(gain)
      gain.connect(lp)
      lp.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.02)
    } catch {}
  }, [muted, getCtx])

  const toggle = useCallback(() => {
    setMuted((v) => !v)
    if (muted) {
      try {
        const ctx = getCtx()
        if (ctx?.state === "suspended") ctx.resume()
      } catch {}
    }
  }, [muted, getCtx])

  const value = useMemo(() => ({ muted, toggle, tick }), [muted, toggle, tick])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")
const rnd = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]

interface SplitFlapTextProps {
  text: string
  className?: string
  speed?: number
}

function Inner({ text, className = "", speed = 50 }: SplitFlapTextProps) {
  const chars = useMemo(() => text.split(""), [text])
  const [key, setKey] = useState(0)
  const [settled, setSettled] = useState(false)
  const audio = useAudio()

  const onEnter = useCallback(() => setKey((k) => k + 1), [])

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`inline-flex gap-[0.08em] items-center cursor-pointer ${className}`}
      aria-label={text}
      style={{ perspective: "1000px" }}
    >
      {chars.map((char, i) => (
        <Tile
          key={i}
          char={char.toUpperCase()}
          index={i}
          animKey={key}
          skipEntrance={settled}
          speed={speed}
          tick={audio?.tick}
        />
      ))}
    </div>
  )
}

export function SplitFlapText(props: SplitFlapTextProps) {
  return <Inner {...props} />
}

interface TileProps {
  char: string
  index: number
  animKey: number
  skipEntrance: boolean
  speed: number
  tick?: () => void
}

function Tile({ char, index, animKey, skipEntrance, speed, tick }: TileProps) {
  const target = CHARSET.includes(char) ? char : " "
  const isSpace = char === " "
  const [current, setCurrent] = useState(skipEntrance ? target : " ")
  const [settled, setSettled] = useState(skipEntrance)
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const delay = 0.15 * index
  const bg = "transparent"
  const color = settled ? "#ffffff" : "#2bfba3"

  useEffect(() => {
    iRef.current && clearInterval(iRef.current)
    tRef.current && clearTimeout(tRef.current)

    if (isSpace) {
      setCurrent(" ")
      setSettled(true)
      return
    }

    setSettled(false)
    setCurrent(rnd())

    let flips = 0
    const threshold = 8 + index * 3
    const startDelay = skipEntrance ? delay * 400 : delay * 800

    tRef.current = setTimeout(() => {
      iRef.current = setInterval(() => {
        if (flips >= threshold) {
          iRef.current && clearInterval(iRef.current)
          setCurrent(target)
          setSettled(true)
          tick?.()
          return
        }
        setCurrent(rnd())
        if (flips % 2 === 0) tick?.()
        flips++
      }, speed)
    }, startDelay)

    return () => {
      iRef.current && clearInterval(iRef.current)
      tRef.current && clearTimeout(tRef.current)
    }
  }, [target, isSpace, delay, animKey, skipEntrance, index, speed, tick])

  if (isSpace) {
    return <div style={{ width: "0.3em", fontSize: "clamp(4rem, 15vw, 14rem)" }} />
  }

  return (
    <motion.div
      initial={skipEntrance ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden flex items-center justify-center font-[family-name:var(--font-bebas)]"
      style={{
        fontSize: "clamp(4rem, 15vw, 14rem)",
        width: "0.65em",
        height: "1.05em",
        backgroundColor: bg,
        transformStyle: "preserve-3d",
        transition: "background-color 0.15s ease",
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/20 pointer-events-none z-10" />

      <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end justify-center overflow-hidden">
        <span className="block translate-y-[0.52em] leading-none transition-colors duration-150" style={{ color }}>
          {current}
        </span>
      </div>

      <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start justify-center overflow-hidden">
        <span className="-translate-y-[0.52em] leading-none transition-colors duration-150" style={{ color }}>
          {current}
        </span>
      </div>

      <motion.div
        key={`${animKey}-${settled}`}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        transition={{
          delay: skipEntrance ? delay * 0.5 : delay + 0.15,
          duration: 0.25,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="absolute inset-x-0 top-0 bottom-1/2 origin-bottom overflow-hidden"
        style={{
          backgroundColor: bg,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transition: "background-color 0.15s ease",
        }}
      >
        <div className="flex h-full items-end justify-center">
          <span className="translate-y-[0.52em] leading-none transition-colors duration-150" style={{ color }}>
            {current}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
