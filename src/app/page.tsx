"use client"

import { useEffect, useRef, useState } from "react"
import { Dithering } from "@paper-design/shaders-react"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Experience from "@/components/experiences"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            entry.target.classList.remove("opacity-0")
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.15, 
        rootMargin: "0px 0px -10% 0px",
      }
    )
    

    const timer = setTimeout(() => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.observe(section)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <Dithering
          colorBack="#121212"
          colorFront="rgba(15, 97, 117, 0.35)"
          speed={0.25}
          shape="simplex"
          type="8x8"
          pxSize={0.15}
          scale={1.13}
          style={{
            backgroundColor: "#000000",
            height: "100vh",
            width: "100vw",
          }}
        />
      </div>

      <Navigation activeSection={activeSection} />

      <main className="relative z-10">
        <Hero 
          ref={(el) => { sectionsRef.current[0] = el }}
          className="opacity-100 animate-fade-in-up"
        />
        
        <About 
          ref={(el) => { sectionsRef.current[1] = el }}
          className="opacity-0"
        />
        
        <Projects 
          ref={(el) => { sectionsRef.current[2] = el }}
          className="opacity-100 md:opacity-0"
        />
        
        <Experience 
          ref={(el) => { sectionsRef.current[3] = el }}
          className="opacity-0"
        />
        
        <Contact 
          ref={(el) => { sectionsRef.current[4] = el }}
          className="opacity-0"
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <Footer />
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-5"></div>
    </div>
  )
}