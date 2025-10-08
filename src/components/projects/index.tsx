import { forwardRef, useState, useEffect } from "react"
import { Github } from "lucide-react"
import { createPortal } from "react-dom"

interface ProjectsProps {
  className?: string
}

interface Project {
  title: string
  description: string
  longDescription: string
  tech: string[]
  image?: string
  gitHub?: string
  status: string
  features: string[]
}

const Projects = forwardRef<HTMLElement, ProjectsProps>(({ className = "" }, ref) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAllFrontend, setShowAllFrontend] = useState(false)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    setIsModalOpen(false)
    document.body.style.overflow = 'unset'
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const frontendProjects: Project[] = [
    {
      title: "Landing Page + Dashboard",
      description: "Landing page com login via Discord, dashboard com temas, sistema de compras com gemas, inventário e integração automática com API FiveM.",
      longDescription: "Este projeto consiste em uma aplicação web completa desenvolvida para a comunidade de roleplay FiveM. A landing page apresenta design moderno e responsivo, com sistema de autenticação integrado ao Discord para facilitar o acesso dos usuários. O dashboard oferece personalização completa com múltiplos temas, permitindo que cada usuário configure sua experiência visual de acordo com suas preferências. O sistema de monetização inclui compra de gemas (moeda virtual), gerenciamento de inventário em tempo real e integração direta com a API do servidor FiveM para sincronização automática de dados.",
      tech: ["Next.js", "React", "Tailwind", "Nhost", "TypeScript", "GraphQL"],
      image: "https://r2.fivemanage.com/h1RaORAfpynzso56Pcf6Z/dnzdevox.png",
      status: "Privado",
      features: [
        "Autenticação Discord OAuth2",
        "Sistema de compras com gateway de pagamento",
        "Inventário em tempo real",
        "API GraphQL customizada",
        "Integração FiveM automática",
      ]
    },
    {
      title: "Painel Admin",
      description: "Dashboard administrativo para controle de produtos, jogadores, servidor e sistema de banimentos.",
      longDescription: "Dashboard administrativo robusto desenvolvido para gerenciamento completo de servidores FiveM. O painel oferece controle total sobre produtos virtuais, gestão de jogadores online e offline.",
      tech: ["Next.js", "React", "Tailwind", "TypeScript", "MySQL"],
      image: "https://r2.fivemanage.com/h1RaORAfpynzso56Pcf6Z/im23age.png",
      status: "Privado",
      features: [
        "Gestão completa de produtos virtuais",
        "Sistema de banimentos com histórico",
        "Monitoramento de servidor em tempo real",
        "Logs de auditoria detalhados",
        "Interface responsiva e intuitiva"
      ]
    },
    {
      title: "Sistema de Armazenamento",
      description: "Plataforma para upload de imagens e arquivos com UI simples e suporte à pasta pública.",
      longDescription: "Solução completa de armazenamento em nuvem com foco em simplicidade e performance. O sistema oferece upload drag-and-drop.",
      tech: ["Next.js", "React", "Tailwind", "TypeScript"],
      image: "https://r2.fivemanage.com/h1RaORAfpynzso56Pcf6Z/im1age.png",
      status: "Privado",
      features: [
        "Upload drag-and-drop intuitivo",
        "Processamento automático de imagens",
        "Sistema de pastas organizacional",
        "Compartilhamento público/privado",
      ]
    },
    {
      title: "Sistema de Loja In-game - FiveM",
      description: "Loja no jogo com sistema de moedas (Coins), compra de mansões, carros e itens. Gerenciamento via painel in-game.",
      longDescription: "Sistema completo de economia virtual integrado diretamente ao servidor FiveM. Permite compra de veículos, propriedades, itens e serviços usando moeda virtual (Coins) e possui um sistema de wishlist.",
      tech: ["Lua", "JavaScript", "React", "Oxmysql"],
      image: "https://r2.fivemanage.com/YhWQSazQTiP1am36BQdDC/imagem_2025-07-11_161758270.png",
      status: "Privado",
      features: [
        "Sistema de moedas virtual completo",
        "Compra de veículos, casas e itens",
        "Sistema de wishlist e favoritos",
      ]
    },
    {
      title: "Portfolio",
      description: "Portfolio feito com Next.js, React, Tailwind, TypeScript e GraphQL.",
      longDescription: "Portfolio pessoal moderno e responsivo desenvolvido com as mais recentes tecnologias web. Design minimalista com animações suave.",
      tech: ["Next.js", "React", "Tailwind", "TypeScript"],
      gitHub: "https://github.com/DnDev77/portfolio",
      status: "Concluído",
      features: []
    }
  ]

  const backendProjects: Project[] = [
    {
      title: "Content Delivery Network - Web",
      description: "CDN para entrega de arquivos e imagens com suporte a cache e compressão.",
      longDescription: "CDN customizada construída do zero para otimizar a entrega de conteúdo estático, compressão automática baseada no tipo de arquivo.",
      tech: ["JavaScript"],
      gitHub: "https://github.com/DnDev77/content-delivery-network",
      status: "Concluído",
      features: [
        "Cache inteligente multi-camadas",
        "Compressão automática de arquivos",
      ]
    },
    {
      title: "Sistema de Autenticação - NestJS",
      description: "Autenticação e recuperação por e-mail.",
      longDescription: "Sistema de autenticação enterprise-grade construído com NestJS. ",
      tech: ["TypeScript", "TypeORM", "NestJS"],
      gitHub: "https://github.com/DnDev77/auth-system",
      status: "Concluído",
      features: [
        "Múltiplos métodos de autenticação",
        "Recuperação por email segura",
      ]
    },
    {
      title: "Sistema de API Server - Fivem",
      description: "API feita em lua para FiveM, com uma estrutura de rotas & controllers, que gera estatísticas, retorna dados de usuários, etc.",
      longDescription: "Framework de API HTTP completo desenvolvido em Lua especificamente para servidores FiveM. Implementa padrão MVC com sistema de rotas expressivo, controllers organizados e middleware personalizável. Gera estatísticas em tempo real, endpoints para dados de usuários e integração com sistemas externos.",
      tech: ["Lua"],
      gitHub: "https://github.com/DnDev77/http-api-server",
      status: "Concluído",
      features: [
        "Sistema de rotas expressivo",
        "Middleware personalizável",
        "Geração de estatísticas em tempo real",
        "Endpoints RESTful padronizados",
        "Sistema de cache integrado",
      ]
    }
  ]

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Em desenvolvimento":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Planejamento":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-[red]/50 text-gray border-gray-500/30"
    }
  }

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
    <div
      key={index}
      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={() => openModal(project)}
    >
      {project.image && (
        <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden mb-4 bg-gray-800/50">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className={`absolute top-2 left-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(project.status)}`}>
            {project.status}
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          {project.gitHub && (
            <Github className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
          )}
        </div>
        
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  const Modal = () => {
    if (!isModalOpen || !selectedProject) return null

    return createPortal(
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={closeModal}
        style={{ minHeight: '100vh' }}
      >
        <div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl w-full max-w-4xl mx-auto my-2 sm:my-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-3 sm:p-4 lg:p-6 sticky top-0 backdrop-blur-sm bg-black/45 rounded-t-xl sm:rounded-t-2xl z-10">
            <div className="flex-1 pr-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight">{selectedProject.title}</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(selectedProject.status)} w-fit`}>
                  {selectedProject.status}
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white/60 hover:text-white transition-colors text-xl sm:text-2xl font-bold leading-none hover:bg-white/10 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0"
            >
              ×
            </button>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {selectedProject.image && (
              <div className="w-full h-40 sm:h-48 lg:h-64 rounded-lg overflow-hidden bg-gray-800/20">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Sobre o Projeto</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                {selectedProject.longDescription}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Tecnologias</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 border border-white/20 rounded-full text-xs sm:text-sm text-white/80 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.features.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-white">Principais Funcionalidades</h3>
                <div className="grid gap-2 lg:grid-cols-2">
                  {selectedProject.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-white/70 text-sm sm:text-base p-2 sm:p-3 rounded-lg bg-white/5">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.gitHub && (
              <div className="pt-3 sm:pt-4 border-t border-white/10">
                <a
                  href={selectedProject.gitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-white bg-cyan-500/20 border border-cyan-400/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                  Ver no GitHub
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <>
      <section id="projects" ref={ref} className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Projetos</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Front-end</h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto"></div>
              </div>
              <div className="space-y-6">
                {(showAllFrontend ? frontendProjects : frontendProjects.slice(0, 2)).map((project, index) => (
                  <ProjectCard key={`frontend-${index}`} project={project} index={index} />
                ))}
                {!showAllFrontend && frontendProjects.length > 2 && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setShowAllFrontend(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-500/20 border border-cyan-400/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                    >
                      Ver mais projetos
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {showAllFrontend && frontendProjects.length > 2 && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setShowAllFrontend(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                    >
                      Ver menos
                      <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent transform -translate-x-px"></div>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Back-end</h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto"></div>
              </div>
              <div className="space-y-6">
                {backendProjects.map((project, index) => (
                  <ProjectCard key={`backend-${index}`} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal />
    </>
  )
})

Projects.displayName = "Projects"

export default Projects
