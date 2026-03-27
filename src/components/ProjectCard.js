'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ImageGallery from './ImageGallery'

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
  Design:          'tag tag-design',
}

// Coarse-pointer check (mobile) — only runs on client
const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function ProjectCard({ project, index }) {
  const modelPath = project.model ? `/models/${project.model}` : null

  // ── Resolve photo media ──────────────────────────────────────────────────
  // Supports:
  //   project.images → string[]  or  { src, alt }[]  (multi-image gallery)
  //   project.image  → string                          (single legacy image)
  const galleryImages = (() => {
    if (project.images?.length) {
      return project.images.map(img =>
        typeof img === 'string' ? { src: `/images/${img}`, alt: project.title } : img
      )
    }
    if (project.image) {
      return [{ src: `/images/${project.image}`, alt: project.title }]
    }
    return []
  })()

  const hasPhotos = galleryImages.length > 0
  const isEven    = index % 2 === 0

  // Default to photo tab on mobile if photos exist (saves GPU on first render)
  const [activeTab, setActiveTab] = useState(() =>
    hasPhotos && isMobile() ? 'photos' : 'model'
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

  // Build available tabs
  const tabs = [
    ...(modelPath   ? ['model']  : []),
    ...(hasPhotos   ? ['photos'] : []),
  ]

  // If there's no model, always show photos
  const effectiveTab = tabs.includes(activeTab) ? activeTab : tabs[0]

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

        {/* ── Media panel ──────────────────────────────────────────────────── */}
        <div className="relative w-full lg:w-1/2 h-72 sm:h-96 lg:h-auto lg:min-h-[480px]">

          {/* Tab switcher — only show when there are multiple tab types */}
          {tabs.length > 1 && (
            <div className="absolute top-4 left-4 z-20 flex border border-ash/10 overflow-hidden rounded-sm">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                    effectiveTab === tab
                      ? 'bg-copper text-ink'
                      : 'bg-ink-800/80 text-ash-400 hover:text-ash'
                  }`}
                >
                  {tab === 'model' ? '3D' : galleryImages.length > 1 ? `Photos · ${galleryImages.length}` : 'Photo'}
                </button>
              ))}
            </div>
          )}

          {/* Project index badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="font-mono text-xs text-ash/20 tracking-widest">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* ── 3D viewer ────────────────────────────────────────────────────
              Only mount after the card enters the viewport AND the 3D tab is
              active — prevents off-screen cards from booting WebGL contexts.
          ─────────────────────────────────────────────────────────────────── */}
          {modelPath && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                effectiveTab === 'model' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {effectiveTab === 'model' && visible && (
                <ModelViewer modelPath={modelPath} />
              )}
            </div>
          )}

          {/* Placeholder when there's truly nothing to show */}
          {!modelPath && !hasPhotos && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-800">
              <span className="font-display text-5xl text-ash/10">
                {project.tags[0] === 'Laser Cutting' ? '◈' : project.tags[0] === '3D Printing' ? '⬡' : '✏'}
              </span>
              <span className="font-mono text-xs text-ash/20 tracking-widest">MEDIA COMING SOON</span>
            </div>
          )}

          {/* ── Photo / Gallery tab ──────────────────────────────────────────
              Renders the ImageGallery carousel (supports 1…N images).
              Stays mounted but visually hidden when 3D tab is active, so the
              gallery scroll position is preserved when the user switches back.
          ─────────────────────────────────────────────────────────────────── */}
          {hasPhotos && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                effectiveTab === 'photos' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Outer wrapper provides the same dark background as the 3D viewer */}
              <div className="w-full h-full bg-ink-800 flex flex-col justify-center py-3 px-2 overflow-hidden">
                <ImageGallery
                  images={galleryImages}
                  aspectRatio="4/3"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Content panel ─────────────────────────────────────────────────── */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center border-t lg:border-t-0 border-ash/5">

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

          {/* Detail bullets */}
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
              {effectiveTab === 'model'
                ? 'AUTO·ROTATE'
                : galleryImages.length > 1
                  ? `${galleryImages.length} PHOTOS`
                  : 'RENDER'}
            </span>
          </div>
        </div>

      </div>
    </article>
  )
}
