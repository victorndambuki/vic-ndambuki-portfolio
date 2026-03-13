import Navigation    from '../components/Navigation'
import Hero          from '../components/Hero'
import ProjectCard   from '../components/ProjectCard'
import AboutSection  from '../components/AboutSection'
import SkillsSection from '../components/SkillsSection'
import ContactSection from '../components/ContactSection'
import { projects }  from '../data/projects'

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <Hero />

      {/* ── PROJECTS ────────────────────────────────── */}
      <section id="projects" className="py-28 sm:py-36 px-6 sm:px-12 bg-ink">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-6">
            <span className="section-label">Projects</span>
            <div className="rule flex-1" />
          </div>

          <div className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display font-light text-4xl sm:text-5xl text-ash leading-tight">
              Featured Work
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="tag tag-laser">Laser Cutting</span>
              <span className="tag tag-3d">3D Printing</span>
              <span className="tag tag-design">Design</span>
            </div>
          </div>

          <div className="space-y-px">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>

        </div>
      </section>

      <AboutSection />
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
