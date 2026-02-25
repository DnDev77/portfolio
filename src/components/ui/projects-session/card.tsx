import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Github, Eye, Code2 } from "lucide-react"
import { PreviewModal } from "@/components/ui/projects-session/preview-modal"
import { CodeViewerModal } from "@/components/ui/projects-session/code-viewer"

export function WorkCard({
  project,
  index,
  persistHover = false,
}: {
  project: {
    title: string
    medium: string
    description: string
    span: string
    image?: string
    github?: string
    url?: string
    preview?: boolean
    viewCode?: boolean
  }
  index: number
  persistHover?: boolean
}) {
  const [isHovered,     setIsHovered]     = useState(false)
  const [isScrollActive,setIsScrollActive] = useState(false)
  const [showPreview,   setShowPreview]   = useState(false)
  const [showCode,      setShowCode]      = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!persistHover || !cardRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        onEnter: () => setIsScrollActive(true),
      })
    }, cardRef)
    return () => ctx.revert()
  }, [persistHover])

  const isActive   = isHovered || isScrollActive
  const canPreview = project.image && project.preview === true
  const canCode    = project.viewCode === true && !!project.github

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(href, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      {showPreview && (
        <PreviewModal project={project} onClose={() => setShowPreview(false)} />
      )}
      {showCode && (
        <CodeViewerModal project={project} onClose={() => setShowCode(false)} />
      )}

      <article
        ref={cardRef}
        className={cn(
          "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden",
          project.span,
          isActive && "border-accent/60",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {project.image && (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-all duration-700",
              isActive ? "opacity-20 scale-105" : "opacity-10 scale-100",
            )}
            style={{ backgroundImage: `url(${project.image})` }}
          />
        )}
        <div
          className={cn(
            "absolute inset-0 bg-accent/5 transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {project.medium}
          </span>
          <h3
            className={cn(
              "mt-3 font-[var(--font-bebas)] text-2xl md:text-4xl tracking-tight transition-colors duration-300",
              isActive ? "text-accent" : "text-foreground",
            )}
          >
            {project.title}
          </h3>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-2">
          <p
            className={cn(
              "font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[240px]",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            )}
          >
            {project.description}
          </p>

          <div
            className={cn(
              "flex items-center gap-2 shrink-0 transition-all duration-500",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            )}
          >
            {canPreview && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(true) }}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200 border border-border/40 hover:border-accent/60 px-2 py-1"
                aria-label="Preview"
              >
                <Eye size={14} />
              </button>
            )}

            {/* View Code button — opens inline code viewer */}
            {canCode && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCode(true) }}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200 border border-border/40 hover:border-accent/60 px-2 py-1"
                aria-label="View Code"
              >
                <Code2 size={14} />
              </button>
            )}

            {project.github && (
              <button
                onClick={(e) => handleLinkClick(e, project.github!)}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200 border border-border/40 hover:border-accent/60 px-2 py-1"
                aria-label="GitHub"
              >
                <Github size={14} />
              </button>
            )}

            {project.url && (
              <button
                onClick={(e) => handleLinkClick(e, project.url!)}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200 border border-border/40 hover:border-accent/60 px-2 py-1"
                aria-label="View project"
              >
                →
              </button>
            )}
          </div>
        </div>

        <span
          className={cn(
            "absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300",
            isActive ? "text-accent" : "text-muted-foreground/40",
            (project.github || project.url || canPreview) && "hidden",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className={cn(
            "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
            isActive ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
        </div>
      </article>
    </>
  )
}