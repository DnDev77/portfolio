"use client"

import {  useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import content from "@/data/index.json"
import { useTranslation } from "@/hooks/useTranslation"
import { useIsMobile } from "@/hooks/useMobile"
import { WorkCard } from "./ui/projects-session/card"
import { MobileWorkCard } from "./ui/projects-session/mobile-card"

gsap.registerPlugin(ScrollTrigger)

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const { t }      = useTranslation()
  const copy       = t.work
  const isMobile   = useIsMobile()

  const projects = content.work.items.map((item) => ({
    ...item,
    ...copy.projects[item.id as keyof typeof copy.projects],
  }))

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
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-20 md:py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      <div ref={headerRef} className="mb-10 md:mb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{copy.sectionLabel}</span>
            <h2 className="mt-3 md:mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{copy.title}</h2>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div ref={gridRef} className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <MobileWorkCard key={index} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]"
        >
          {projects.map((project, index) => (
            <WorkCard key={index} project={project} index={index} persistHover={index === 0} />
          ))}
        </div>
      )}
    </section>
  )
}