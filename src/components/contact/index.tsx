import Link from "next/link"
import { forwardRef } from "react"
import {
    Github,
    Linkedin,
    Sun,
    Moon,
    Mail,
    Instagram,
} from "lucide-react"

interface ContactProps {
    className?: string
    isDark: boolean
    toggleTheme: () => void
}

const Contact = forwardRef<HTMLElement, ContactProps>(
    ({ className = "", isDark, toggleTheme }, ref) => {
        const socialLinks = [
            { name: "GitHub", link: "https://github.com/DnDev77", icon: <Github size={20} /> },
            { name: "LinkedIn", link: "https://linkedin.com/in/dnzxdevop", icon: <Linkedin size={20} /> },
            { name: "Instagram", link: "https://instagram.com/dn.angelo_", icon: <Instagram size={20} /> },
            { name: "Email", link: "mailto:contato.dnzxdev@gmail.com", icon: <Mail size={20} /> },
        ]

        return (
            <section
                id="contact"
                ref={ref}
                className={`py-20 px-6 ${className}`}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Vamos Conversar
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6"></div>
                            <p className="text-xl text-white/70 max-w-2xl mx-auto">
                                Sempre aberto a novas oportunidades, colaborações e conversas sobre tecnologia e inovação.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="mailto:contato.dnzxdev@gmail.com"
                                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 hover:scale-105"
                            >
                                <Mail size={20} />
                                Entre em contato
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-8">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.link}
                                    className="group flex flex-col items-center justify-center text-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="text-white/80 mb-2">{social.icon}</div>
                                    <div className="text-white/80 font-medium text-sm">{social.name}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
)

Contact.displayName = "Contact"

export default Contact
