import { forwardRef } from "react"

interface ExperienceProps {
  className?: string
}

const Experience = forwardRef<HTMLElement, ExperienceProps>(({ className = "" }, ref) => {
  const experiences = [
    {
      period: "2025",
      role: "Tech Lead",
      company: "Central Group - FiveM",
      description: "Desenvolvimento de soluções no ecossistema de FiveM, criação de websites responsivos e integração de APIs.",
      highlights: [
        "Desenvolvimento de scripts proprios",
        "Correção de bugs e problemas",
        "Gerenciamente de time de desenvolvimento"
      ]
    },
    {
      period: "2024",
      role: "CTO",
      company: "New Valley - FiveM",
      description: "Desenvolvimento de soluções no FiveM, criação interfaces e implementação de funcionalidades em sistemas existentes.",
      highlights: [
        "Correção de bugs e problemas",
        "Gerenciamente de time de desenvolvimento"
      ]
    },
  ]

  return (
    <section
      id="experience"
      ref={ref}
      className={`py-20 px-6 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experiência
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div
              key={index}
              className="relative pl-8 pb-12 border-l-2 border-white/10 last:border-l-0 last:pb-0"
            >
              <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{experience.role}</h3>
                    <div className="text-cyan-400 font-medium">{experience.company}</div>
                  </div>
                  <div className="text-white/60 text-sm font-mono mt-2 md:mt-0">{experience.period}</div>
                </div>

                <p className="text-white/80 mb-4 leading-relaxed">{experience.description}</p>

                <div className="space-y-2">
                  {experience.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

Experience.displayName = "Experience"

export default Experience