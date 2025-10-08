import { forwardRef } from "react"

interface AboutProps {
  className?: string
}

const About = forwardRef<HTMLElement, AboutProps>(({ className = "" }, ref) => {
  const skills = [
    "React", "TypeScript", "Next.js", "Node.js", "TailwindCSS", "GraphQL", "PostgreSQL", "Lua", "Python"
  ]

  return (
    <section
      id="about"
      ref={ref}
      className={`py-20 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Sobre Mim
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>
            
            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p>
                Olá, eu sou o Daniel, sou um desenvolvedor fullstack  que resolve problemas & bugs e comecei minha trajetoria com FiveM, utilizando a linguagem Lua.
              </p>
              <p>
                Atualmente focado em desenvolvimento Fullstack, utilizando as tecnologias React, Next.js, Node.js, TypeScript, TailwindCSS, GraphQL, PostgreSQL, entre outras.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-8">
              <div className="h-full bg-gradient-to-br from-white/5 to-transparent rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="rounded-2xl overflow-hidden">
                    <img src="https://avatars.githubusercontent.com/u/235958130" alt="Dn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

About.displayName = "About"

export default About
