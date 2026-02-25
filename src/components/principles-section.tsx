"use client"

import { useRef, useEffect } from "react"
import { HighlightText } from "@/components/ui/text-effects/highlight-text"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "@/hooks/useTranslation"
import { useIsMobile } from "@/hooks/useMobile"

gsap.registerPlugin(ScrollTrigger)

export function PrinciplesSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const headerRef     = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)

  const { t }          = useTranslation()
  const { principles } = t
  const isMobile       = useIsMobile()

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !principlesRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      const articles = principlesRef.current?.querySelectorAll("article")
      articles?.forEach((article, index) => {
        const isRight = !isMobile && principles.items[index].align === "right"
        gsap.from(article, {
          x: isRight ? 80 : -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [t, isMobile])

  return (
    <section ref={sectionRef} id="principles" className="relative py-20 md:py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      <div ref={headerRef} className="mb-16 md:mb-24">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          {principles.sectionLabel}
        </span>
        <h2 className="mt-3 md:mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          {principles.title}
        </h2>
      </div>

      <div ref={principlesRef} className="space-y-16 md:space-y-32">
        {principles.items.map((principle, index) => {
          const alignRight = !isMobile && principle.align === "right"

          return (
            <article
              key={index}
              className={`flex flex-col ${
                alignRight ? "items-end text-right" : "items-start text-left"
              }`}
            >
              <div className={`flex items-center gap-3 mb-4 ${alignRight ? "flex-row-reverse" : "flex-row"}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {principle.number}
                </span>
                <div className="w-8 h-[1px] bg-accent/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {principle.titleParts[0].text.split(" ")[0]}
                </span>
              </div>

              <h3
                className={cn(
                  "font-[var(--font-bebas)] tracking-tight leading-none",
                  isMobile
                    ? "text-[clamp(2.5rem,11vw,4rem)]"
                    : "text-4xl md:text-6xl lg:text-8xl",
                )}
              >
                {principle.titleParts.map((part, i) =>
                  part.highlight ? (
                    <HighlightText key={i} parallaxSpeed={0.6}>
                      {part.text}
                    </HighlightText>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </h3>

              <p className="mt-4 md:mt-6 max-w-sm md:max-w-md font-mono text-[10px] md:text-sm text-muted-foreground leading-relaxed">
                {principle.description}
              </p>

              <div
                className={`mt-6 md:mt-8 h-[1px] bg-border w-16 md:w-48 ${
                  alignRight ? "mr-0" : "ml-0"
                }`}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}