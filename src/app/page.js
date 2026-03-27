import Navigation      from '../components/Navigation'
import Hero            from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import AboutSection    from '../components/AboutSection'
import GallerySection  from '../components/GallerySection'
import SkillsSection   from '../components/SkillsSection'
import ContactSection  from '../components/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <Hero />
      <ProjectsSection />
      <AboutSection />
      <GallerySection />
      <SkillsSection />
      <ContactSection />

      {/* Footer */}
      <footer className="bg-ink border-t border-ash/5 py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-ash/20 tracking-widest">
            © {new Date().getFullYear()} VIC NDAMBUKI
          </span>
          <span className="font-mono text-xs text-ash/15 tracking-widest">
            MECHANICAL ENGINEERING · NAIROBI, KENYA
          </span>
        </div>
      </footer>
    </main>
  )
}
