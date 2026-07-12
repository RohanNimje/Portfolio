import Hero from '@/components/Hero'
import ProjectsBento from '@/components/ProjectsBento'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import HonorsCarousel from '@/components/HonorsCarousel'
import CertificationsCoverFlow from '@/components/CertificationsCoverFlow'
import StreakEducation from '@/components/StreakEducation'
import ContactFooter from '@/components/ContactFooter'
import Navigation from '@/components/Navigation'

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] text-slate-800">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="scroll-mt-20">
        <Hero />
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <ProjectsBento />
      </section>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <ExperienceTimeline />
      </section>

      {/* Honors Section */}
      <section id="honors" className="scroll-mt-20">
        <HonorsCarousel />
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="scroll-mt-20">
        <CertificationsCoverFlow />
      </section>

      {/* Streak & Education */}
      <section id="education" className="scroll-mt-20">
        <StreakEducation />
      </section>

      {/* Contact Footer */}
      <ContactFooter />
    </main>
  )
}
