import { HeroSection } from "@/components/main-section"
import { TechsSection } from "@/components/techs-section"
import { WorkSection } from "@/components/projects-section"
import { PrinciplesSection } from "@/components/principles-section"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <TechsSection />
        <WorkSection />
        <PrinciplesSection />
      </div>
    </main>
  )
}