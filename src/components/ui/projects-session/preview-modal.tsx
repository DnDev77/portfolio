"use client"

import { useRef, useEffect, useCallback } from "react"
import gsap from "gsap"
import { Github, Eye, X, ArrowUpRight } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export function PreviewModal({
  project,
  onClose,
}: {
  project: {
    title: string
    medium: string
    description: string
    image?: string
    github?: string
    url?: string
  }
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const { t }      = useTranslation()
  const modal      = t.work.modal

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
      gsap.fromTo(
        panelRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", delay: 0.05 },
      )
    })
    return () => ctx.revert()
  }, [])

  const handleClose = useCallback(() => {
    const ctx = gsap.context(() => {
      gsap.to(panelRef.current, { y: 30, opacity: 0, scale: 0.97, duration: 0.3, ease: "power2.in" })
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: onClose })
    })
    return () => ctx.revert()
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && handleClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-3xl border border-border/60 bg-background overflow-hidden max-h-[92dvh] overflow-y-auto rounded-t-sm sm:rounded-none"
        style={{ boxShadow: "0 0 0 1px rgba(var(--accent-rgb),0.15), 0 32px 80px rgba(0,0,0,0.7)" }}
      >
        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-accent" />
          <div className="absolute top-0 left-0 w-[1px] h-full bg-accent" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
        </div>

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border/60" />
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1.5 border border-border/40 hover:border-accent/60 text-muted-foreground hover:text-accent transition-colors duration-200"
          aria-label={modal.close}
        >
          <X size={14} />
        </button>

        {project.image && (
          <div className="relative w-full aspect-video overflow-hidden border-b border-border/40">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        <div className="p-5 md:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {project.medium}
          </span>
          <h3 className="mt-3 font-[var(--font-bebas)] text-3xl md:text-5xl tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-4 font-mono text-[11px] md:text-xs text-muted-foreground leading-relaxed max-w-xl">
            {project.description}
          </p>

          {(project.github || project.url) && (
            <div className="mt-6 flex items-center gap-3 border-t border-border/30 pt-5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2.5 transition-colors duration-200"
                >
                  <Github size={12} />
                  {modal.github}
                </a>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2.5 transition-colors duration-200"
                >
                  <ArrowUpRight size={12} />
                  {modal.viewProject}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}