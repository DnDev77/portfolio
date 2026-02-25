import type { Tech } from "@/types"
import { cn } from "@/lib/utils";

export function TechCard({
  tech,
  levelLabels,
}: {
  tech: Tech
  levelLabels: { core: string; proficient: string; familiar: string }
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col items-center gap-3 p-5",
        "bg-card border border-border/50",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/5",
        "cursor-default",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tech.icon}
          alt={tech.name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{ filter: "grayscale(30%)" }}
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = "none"
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = "flex"
          }}
        />
        <span
          className="hidden absolute inset-0 items-center justify-center font-[var(--font-bebas)] text-xl text-accent"
          aria-hidden
        >
          {tech.name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight">
        {tech.name}
      </span>

      {tech.level && (
        <span
          className={cn(
            "font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5",
            tech.level === "core"       && "text-accent bg-accent/10",
            tech.level === "proficient" && "text-muted-foreground bg-muted/40",
            tech.level === "familiar"   && "text-muted-foreground/50 bg-transparent",
          )}
        >
          {levelLabels[tech.level]}
        </span>
      )}

      <div className="absolute bottom-0 right-0 w-4 h-4 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-background rotate-45 translate-x-3 translate-y-3 border-t border-l border-border/30" />
      </div>
    </article>
  )
}