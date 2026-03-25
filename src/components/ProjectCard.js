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

const TAG_STYLES = { 'Laser Cutting': 'tag tag-laser', '3D Printing': 'tag tag-3d', Design: 'tag tag-design' }

// Detect mobile/coarse-pointer once at module level (client only)
const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function ProjectCard({ project, index }) {
  const modelPath = project.model ? `/models/${project.model}` : null
  const imagePath = project.image ? `/images/${project.image}` : null
  const isEven    = index % 2 === 0

  // On mobile, default to photo tab if an image exists (big perf win)
  // On desktop, default to 3D model tab
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
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const tabs = ['model', ...(imagePath ? ['image'] : [])]

  return (
    <article
      ref={ref}
      className="border border-ash/5 rounded-sm overflow-hidden bg-card"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms,
                     transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
      }}
    >
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

        {/* ── Viewer ── */}
        <div className="relative w-full lg:w-1/2 h-72 sm:h-96 lg:h-auto lg:min-h-[480px]">

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

          {/* Project index */}
          <div className="absolute top-4 right-4 z-20">
            <span className="font-mono text-xs text-ash/20 tracking-widest">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* 3D viewer — only mount the Canvas when the tab is active */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              activeTab === 'model' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Only render Three.js when the model tab is actually selected.
                This prevents invisible canvases from consuming GPU on mobile. */}
            {activeTab === 'model' && modelPath && (
              <ModelViewer modelPath={modelPath} />
            )}

            {/* Placeholder when no model file is available */}
            {!modelPath && activeTab === 'model' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-800">
                <span className="font-display text-5xl text-ash/10">
                  {project.tags[0] === 'Laser Cutting' ? '◈' : project.tags[0] === '3D Printing' ? '⬡' : '✏'}
                </span>
                <span className="font-mono text-xs text-ash/20 tracking-widest">MODEL COMING SOON</span>
              </div>
            )}
          </div>

          {/* Photo */}
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
        </div>

        {/* ── Content ── */}
        <div
          className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center border-t lg:border-t-0 border-ash/5"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(t => (
              <span key={t} className={TAG_STYLES[t] || 'tag tag-design'}>{t}</span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-display font-light text-3xl sm:text-4xl text-ash leading-tight mb-5">
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-sans font-light text-ash-400 text-sm leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Details */}
          {project.details?.length > 0 && (
            <ul className="space-y-2.5 mb-10">
              {project.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs text-ash-400/60">
                  <span className="text-copper mt-0.5 flex-shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-ash/5">
            <span className="font-mono text-xs text-ash/15 tracking-widest">
              PROJECT · {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-copper/50 tracking-wide">
              {activeTab === 'model' ? 'AUTO·ROTATE' : 'RENDER'}
            </span>
          </div>
        </div>

      </div>
    </article>
  )
}
