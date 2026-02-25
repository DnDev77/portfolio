"use client"

import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface HighlightTextProps {
  children: ReactNode
  className?: string
  parallaxSpeed?: number
}

export function HighlightText({ children, className = "", parallaxSpeed = 0.3 }: HighlightTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!rootRef.current || !fillRef.current || !labelRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "top -20%",
          toggleActions: "play reverse play reverse",
        },
      })

      tl.fromTo(
        fillRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.2, ease: "power3.out" },
      )

      tl.fromTo(
        labelRef.current,
        { color: "rgb(245, 245, 245)" },
        { color: "#0a0a0a", duration: 0.6, ease: "power2.out" },
        0.5,
      )

      gsap.to(fillRef.current, {
        yPercent: -20 * parallaxSpeed,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [parallaxSpeed])

  return (
    <span ref={rootRef} className={`relative inline-block ${className}`}>
      <span
        ref={fillRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "#2bfba3",
          left: "-0.1em",
          right: "-0.1em",
          top: "0.15em",
          bottom: "0.1em",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />
      <span ref={labelRef} className="relative z-10">
        {children}
      </span>
    </span>
  )
}