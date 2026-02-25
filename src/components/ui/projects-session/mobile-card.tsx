import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { Github, Eye, ArrowUpRight, Code2 } from "lucide-react"
import { PreviewModal } from "@/components/ui/projects-session/preview-modal"
import { CodeViewerModal } from "@/components/ui/projects-session/code-viewer"

export function MobileWorkCard({
  project,
  index,
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
}) {
  const [expanded,    setExpanded]    = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showCode,    setShowCode]    = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)

  const canPreview = project.image && project.preview === true
  const canCode    = project.viewCode === true && !!project.github

  useEffect(() => {
    if (!detailRef.current) return
    if (expanded) {
      gsap.fromTo(
        detailRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.35, ease: "power3.out" },
      )
    } else {
      gsap.to(detailRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" })
    }
  }, [expanded])

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
        className={cn(
          "border border-border/40 transition-all duration-300 overflow-hidden",
          expanded && "border-accent/50",
        )}
      >
        <button
          className="w-full flex items-center justify-between px-4 py-4 text-left"
          onClick={() => setExpanded((p) => !p)}
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-mono text-[10px] text-muted-foreground/40 shrink-0 w-5">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.image ? (
              <div
                className="w-9 h-9 shrink-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            ) : (
              <div className="w-9 h-9 shrink-0 border border-border/30 flex items-center justify-center">
                <span className="font-[var(--font-bebas)] text-xs text-accent">
                  {project.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-[var(--font-bebas)] text-xl tracking-tight text-foreground truncate leading-none">
                {project.title}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                {project.medium}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "font-mono text-muted-foreground/50 transition-transform duration-300 shrink-0 ml-2",
              expanded ? "rotate-45 text-accent" : "rotate-0",
            )}
          >
            +
          </span>
        </button>

        <div ref={detailRef} className="overflow-hidden h-0 opacity-0">
          <div className="px-4 pb-5 border-t border-border/30">
            {project.image && (
              <div className="mt-4 w-full aspect-video overflow-hidden mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mt-3">
              {project.description}
            </p>

            {(project.github || project.url || canPreview || canCode) && (
              <div className="mt-4 flex items-center flex-wrap gap-2">
                {canPreview && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2 transition-colors duration-200"
                  >
                    <Eye size={11} />
                    Preview
                  </button>
                )}
                {/* View Code button */}
                {canCode && (
                  <button
                    onClick={() => setShowCode(true)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2 transition-colors duration-200"
                  >
                    <Code2 size={11} />
                    View Code
                  </button>
                )}
                {project.github && (
                  <button
                    onClick={(e) => handleLinkClick(e, project.github!)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2 transition-colors duration-200"
                  >
                    <Github size={11} />
                    GitHub
                  </button>
                )}
                {project.url && (
                  <button
                    onClick={(e) => handleLinkClick(e, project.url!)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-3 py-2 transition-colors duration-200"
                  >
                    <ArrowUpRight size={11} />
                    Visit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  )
}