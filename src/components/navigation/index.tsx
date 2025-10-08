interface NavigationProps {
    activeSection: string
}

const Navigation = ({ activeSection }: NavigationProps) => {
    const sections = [
        { id: "hero", label: "Início" },
        { id: "about", label: "Sobre" },
        { id: "projects", label: "Projetos" },
        { id: "experience", label: "Experiência" },
        { id: "contact", label: "Contato" }
    ]

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-6">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`group relative p-3 rounded-full transition-all duration-500 ${activeSection === section.id
                            ? "bg-white/10 backdrop-blur-sm border border-white/20"
                            : "hover:bg-white/5 hover:backdrop-blur-sm"
                        }`}
                    aria-label={`Navigate to ${section.label}`}
                >
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${activeSection === section.id ? "bg-white" : "bg-white/30 group-hover:bg-white/60"
                        }`} />
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {section.label}
                    </span>
                </button>
            ))}
        </nav>
    )
}

export default Navigation