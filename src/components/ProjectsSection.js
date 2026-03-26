'use client'

import { useState, useMemo } from 'react'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'

const FILTERS = ['All', 'Laser Cutting', '3D Printing', 'Design']

export default function ProjectsSection() {
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () => active === 'All' ? projects : projects.filter(p => p.tags.includes(active)),
    [active]
  )

  return (
    <section id="projects" className="py-28 sm:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <span className="section-label">Projects</span>
          <div className="rule flex-1" />
        </div>

        {/* Heading row */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-ash leading-tight">
            Featured Work
          </h2>
          {/* Tag legend */}
          <div className="flex flex-wrap gap-2">
            <span className="tag tag-laser">Laser Cutting</span>
            <span className="tag tag-3d">3D Printing</span>
            <span className="tag tag-design">Design</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`
                px-5 py-2 font-mono text-xs tracking-widest uppercase transition-all duration-250 rounded-sm
                ${active === f
                  ? 'bg-copper text-ink'
                  : 'border border-ash/10 text-ash/40 hover:border-copper/40 hover:text-copper'}
              `}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-2 opacity-50">
                  {projects.filter(p => p.tags.includes(f)).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards — full-bleed stack with 1px gap dividers */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col gap-px">
          {filtered.length > 0
            ? filtered.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i}
                  featured={i === 0}
                />
              ))
            : (
              <div className="py-24 text-center border border-ash/5 rounded-sm">
                <span className="font-mono text-xs text-ash/20 tracking-widest">
                  NO PROJECTS IN THIS CATEGORY YET
                </span>
              </div>
            )
          }
        </div>
      </div>
    </section>
  )
}
