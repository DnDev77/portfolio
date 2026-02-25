"use client";

import { useEffect, useRef, useState } from "react";
import { ScrambleTextOnHover } from "@/components/ui/text-effects/scramble-text";
import {
  SplitFlapText,
  SplitFlapAudioProvider,
} from "@/components/ui/text-effects/split-flap-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/useMobile";
import { CodeModel3D } from "@/components/ui/main-session/code";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { hero } = t;
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: isMobile ? -60 : -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Loading...
        </span>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12"
    >
      {!isMobile && (
        <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
            {hero.sideLabel}
          </span>
        </div>
      )}

      <div
        ref={contentRef}
        className="flex-1 w-full flex items-center gap-0 md:gap-8"
      >
        <div className="flex-1 min-w-0">
          <SplitFlapAudioProvider>
            <div className="relative">
              <SplitFlapText text={hero.name} speed={80} />
            </div>
          </SplitFlapAudioProvider>

          <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(0.85rem,4vw,2rem)] mt-3 md:mt-4 tracking-wide">
            {hero.role}
          </h2>

          <p className="mt-8 md:mt-12 max-w-md font-mono text-[11px] md:text-sm text-muted-foreground leading-relaxed">
            {hero.description}
          </p>

          <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 border border-foreground/20 px-5 py-3 md:px-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
            >
              <ScrambleTextOnHover
                text={hero.cta.primary}
                as="span"
                duration={0.6}
              />
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 border border-foreground/20 px-5 py-3 md:px-6 font-mono text-[10px] md:text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
            >
              <ScrambleTextOnHover
                text={hero.cta.contact}
                as="span"
                duration={0.6}
              />
            </a>
          </div>

          {isMobile && (
            <div className="mt-12 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                {hero.sideLabel}
              </span>
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center justify-center w-[45%] shrink-0 h-screen max-h-[700px] pointer-events-auto">
            <CodeModel3D />
          </div>
        )}
      </div>
    </section>
  );
}
