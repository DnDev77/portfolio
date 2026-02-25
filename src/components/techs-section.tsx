"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import portfolio from "@/data/index.json"
import type { PortfolioData, Tech } from "@/types"
import { MobileTechCard } from "./ui/tech-session/mobile-card"
import { TechCard } from "./ui/tech-session/card"
import { useTranslation } from "@/hooks/useTranslation"
import { useIsMobile } from "@/hooks/useMobile"

gsap.registerPlugin(ScrollTrigger)

const data = portfolio as PortfolioData
const TECHS = data.techs

const INITIAL_COUNT = 6

export function TechsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const cursorRef  = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [showAll, setShowAll]       = useState(false)
  const isMobile = useIsMobile()

  const { t } = useTranslation()
  const { techs: copy } = t

  const visibleTechs = showAll ? TECHS : TECHS.slice(0, INITIAL_COUNT)
  useEffect(() => {
    if (isMobile) return
    const section = sectionRef.current
    const cursor  = cursorRef.current
    if (!section || !cursor) return

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      gsap.to(cursor, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.45,
        ease: "power3.out",
      })
    }
    section.addEventListener("mousemove",  onMove)
    section.addEventListener("mouseenter", () => setIsHovering(true))
    section.addEventListener("mouseleave", () => setIsHovering(false))
    return () => {
      section.removeEventListener("mousemove",  onMove)
      section.removeEventListener("mouseenter", () => setIsHovering(true))
      section.removeEventListener("mouseleave", () => setIsHovering(false))
    }
  }, [isMobile])

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!showAll || !gridRef.current) return
    const cards = gridRef.current.querySelectorAll("article")
    const newCards = Array.from(cards).slice(INITIAL_COUNT)
    if (newCards.length > 0) {
      gsap.fromTo(
        newCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" },
      )
    }
  }, [showAll])

  const remaining = TECHS.length - INITIAL_COUNT

  return (
    <section
      id="techs"
      ref={sectionRef}
      className="relative py-20 md:py-32 pl-6 md:pl-28 pr-6 md:pr-16"
    >
      {!isMobile && (
        <div
          ref={cursorRef}
          className={cn(
            "pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-50",
            "w-10 h-10 rounded-full border-2 border-accent bg-accent/20 backdrop-blur-sm",
            "transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      <div ref={headerRef} className="mb-10 md:mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          {copy.sectionLabel}
        </span>
        <h2 className="mt-3 md:mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          {copy.title}
        </h2>
        <p className="mt-2 md:mt-3 font-mono text-[10px] md:text-xs text-muted-foreground max-w-md leading-relaxed">
          {copy.subtitle}
        </p>
      </div>

      {isMobile ? (
        <div ref={gridRef} className="grid grid-cols-3 gap-2">
          {visibleTechs.map((tech, i) => (
            <MobileTechCard key={i} tech={tech} levelLabels={copy.levels} />
          ))}
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
        >
          {visibleTechs.map((tech, i) => (
            <TechCard key={i} tech={tech} levelLabels={copy.levels} />
          ))}
        </div>
      )}

      {TECHS.length > INITIAL_COUNT && (
        <div className="mt-8 md:mt-10 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className={cn(
              "group relative font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em]",
              "px-6 md:px-8 py-3 border border-border/50 w-full sm:w-auto",
              "text-muted-foreground hover:text-foreground",
              "hover:border-accent/40 hover:bg-accent/5",
              "transition-all duration-300 ease-out",
              "cursor-pointer",
            )}
          >
            <span className="absolute inset-x-0 top-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            {showAll
              ? copy.showLess
              : copy.showMore.replace("{count}", String(remaining))
            }
            <span className="absolute bottom-0 right-0 w-3 h-3 overflow-hidden">
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-background rotate-45 translate-x-2.5 translate-y-2.5 border-t border-l border-border/30" />
            </span>
          </button>
        </div>
      )}
    </section>
  )
}