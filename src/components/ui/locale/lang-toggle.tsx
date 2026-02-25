"use client";

import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale, mounted } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const hasSeenTooltip = sessionStorage.getItem("lang-tooltip-seen");
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        sessionStorage.setItem("lang-tooltip-seen", "true");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  if (!mounted) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute top-full mt-2 right-0 z-50 w-64 rounded-sm border border-border/60 bg-popover px-3 py-2 shadow-md",
          "text-[11px] text-muted-foreground leading-relaxed",
          "transition-all duration-300",
          showTooltip
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none",
        )}
      >
        <span
          className="absolute -top-[5px] right-4 h-2.5 w-2.5 rotate-45 border-t border-l border-border/60 bg-popover"
          aria-hidden
        />
        Identifiquei seu idioma automaticamente. Caso esteja errado, troque
        através desse botão.
      </div>
      <div
        className={cn(
          "flex items-center gap-0 border border-border/40 overflow-hidden font-mono text-[10px] uppercase tracking-widest",
        )}
      >
        <button
          onClick={() => setLocale("pt-BR")}
          className={cn(
            "px-2.5 py-1.5 transition-all duration-200",
            locale === "pt-BR"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
          )}
          aria-label="Português (Brasil)"
        >
          PT
        </button>
        <span className="w-[1px] h-4 bg-border/60 shrink-0" />
        <button
          onClick={() => setLocale("en-US")}
          className={cn(
            "px-2.5 py-1.5 transition-all duration-200",
            locale === "en-US"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
          )}
          aria-label="English (US)"
        >
          EN
        </button>
      </div>
    </div>
  );
}
