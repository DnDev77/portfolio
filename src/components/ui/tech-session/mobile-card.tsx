import type { Tech } from "@/types"
import { cn } from "@/lib/utils";

export function MobileTechCard({
  tech,
  levelLabels,
}: {
  tech: Tech
  levelLabels: { core: string; proficient: string; familiar: string }
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col items-center gap-2 p-3",
        "bg-card border border-border/50",
        "active:border-accent/40 active:bg-accent/5",
        "transition-all duration-200",
        "cursor-default",
      )}
    >
      {tech.level && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[2px]",
            tech.level === "core"       && "bg-accent",
            tech.level === "proficient" && "bg-muted-foreground/40",
            tech.level === "familiar"   && "bg-transparent",
          )}
        />
      )}

      <div className="relative w-7 h-7 flex items-center justify-center mt-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tech.icon}
          alt={tech.name}
          width={28}
          height={28}
          className="w-7 h-7 object-contain opacity-70"
          style={{ filter: "grayscale(30%)" }}
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = "none"
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = "flex"
          }}
        />
        <span
          className="hidden absolute inset-0 items-center justify-center font-[var(--font-bebas)] text-sm text-accent"
          aria-hidden
        >
          {tech.name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <span className="font-mono text-[9px] text-muted-foreground text-center leading-tight">
        {tech.name}
      </span>
    </article>
  )
}