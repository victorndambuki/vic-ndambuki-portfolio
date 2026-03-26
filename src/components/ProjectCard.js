'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ink-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border border-copper/40 border-t-copper rounded-full animate-spin" />
        <span className="font-mono text-xs text-ash-400/50 tracking-widest">LOADING MODEL</span>
      </div>
    </div>
  ),
})

const TAG_STYLES = {
  'Laser Cutting': 'tag tag-laser',
  '3D Printing':   'tag tag-3d',
  'Design':        'tag tag-design',
}

const CATEGORY_ICON = {
  'Laser Cutting': '◈',
  '3D Printing':   '⬡',
  'Design':        '✏',
}

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function ProjectCard({ project, index, featured }) {
  const modelPath = project.model ? `/models/${project.model}` : null
  const imagePath = project.image ? `/images/${project.image}` : null
  const isEven    = index % 2 === 0

  const [activeTab, setActiveTab] = useState(() =>
    imagePath && isMobile() ? 'image' : 'model'
  )
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const tabs = ['model', ...(imagePath ? ['image'] : [])]
  const icon = project.tags[0] ? (CATEGORY_ICON[project.tags[0]] || '◈') : '◈'

  return (
    <article
      ref={ref}
      className={`
        group border border-ash/5 overflow-hidden bg-card
        transition-all duration-500
        hover:border-copper/10
        ${featured ? '' : ''}
      `}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms,
                     transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms,
                     border-color 0.4s`,
      }}
    >
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

        {/* ── Viewer ── */}
        <div
          className={`
            viewer-bg
            relative w-full overflow-hidden
            ${featured ? 'lg:w-[55%] h-72 sm:h-96 lg:min-h-[540px]' : 'lg:w-1/2 h-72 sm:h-96 lg:min-h-[480px]'}
          `}
        >
          {/* Blueprint grid inside viewer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(196,112,63,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(196,112,63,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Ghost project number */}
          <div
            className="absolute -bottom-6 -left-3 pointer-events-none select-none"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(120px, 16vw, 200px)',
              fontWeight: 300,
              color: 'rgba(196,112,63,0.045)',
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Tab switcher */}
          <div className="absolute top-4 left-4 z-20 flex border border-ash/10 overflow-hidden rounded-sm">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-copper text-ink'
                    : 'bg-ink-800/80 text-ash-400 hover:text-ash'
                }`}
              >
                {tab === 'model' ? '3D' : 'Photo'}
              </button>
            ))}
          </div>

          {/* Project index badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="font-mono text-xs text-ash/20 tracking-widest">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* 3D viewer */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === 'model' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {activeTab === 'model' && modelPath && visible && (
              <ModelViewer modelPath={modelPath} />
            )}
            {!modelPath && activeTab === 'model' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-800/40">
                <span className="font-display text-5xl text-ash/8">{icon}</span>
                <span className="font-mono text-xs text-ash/15 tracking-widest">MODEL COMING SOON</span>
              </div>
            )}
          </div>

          {/* Photo tab */}
          {imagePath && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeTab === 'image' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePath} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Bottom hint (only shown when in 3D tab; ModelViewer has its own hint) */}
        </div>

        {/* ── Content panel ── */}
        <div
          className={`
            w-full flex flex-col justify-center
            p-8 sm:p-10 lg:p-14
            border-t lg:border-t-0 border-ash/5
            ${isEven ? 'lg:border-l border-l-ash/5' : 'lg:border-r border-r-ash/5'}
            ${featured ? 'lg:w-[45%]' : 'lg:w-1/2'}
          `}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(t => (
              <span key={t} className={TAG_STYLES[t] || 'tag tag-design'}>{t}</span>
            ))}
          </div>

          {/* Title */}
          <h3
            className={`
              font-display font-light text-ash leading-tight mb-5
              ${featured ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}
            `}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-sans font-light text-ash-400 text-sm leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Detail bullets */}
          {project.details?.length > 0 && (
            <ul className="space-y-3 mb-10">
              {project.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs text-ash-400/50">
                  <span className="text-copper mt-0.5 flex-shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-ash/5">
            <span className="font-mono text-xs text-ash/12 tracking-widest">
              PROJECT · {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-copper/40 tracking-wide group-hover:text-copper/70 transition-colors duration-300">
              {activeTab === 'model' ? 'AUTO · ROTATE' : 'RENDER'}
            </span>
          </div>
        </div>

      </div>
    </article>
  )
}
