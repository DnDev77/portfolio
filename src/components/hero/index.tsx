import { forwardRef } from "react"

interface HeroProps {
  className?: string
}

const Hero = forwardRef<HTMLElement, HeroProps>(({ className = "" }, ref) => {
  return (
    <section
      id="hero"
      ref={ref}
      className={`min-h-screen flex items-center justify-center px-6 ${className}`}
    >
      <div className="text-center max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-sm text-white/60 font-mono tracking-[0.2em] uppercase">
              Fullstack Developer
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                DANIEL
              </span>
            </h1>
          </div>
          
          {/* <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Desenvolvedor Fullstack
          </p> */}

          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-sm">Disponível para projetos</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <span className="text-white/60 text-sm">Juiz de Fora, MG</span>
          </div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"

export default Hero