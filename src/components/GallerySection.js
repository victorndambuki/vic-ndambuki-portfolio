'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

// ═══════════════════════════════════════════════════════════════
// ADD YOUR IMAGES HERE
// Put files in public/images/ and list them below.
//
// { src: 'filename.jpg', alt: 'Description', label: 'Optional tag' }
// ═══════════════════════════════════════════════════════════════
const GALLERY_IMAGES = [
  { src: '/images/vintage_car.jpg',   alt: 'Vintage Model Car',          label: 'Laser Cutting' },
  { src: '/images/gas_lighter1.jpg',  alt: 'Piezo-electric Gas Lighter',  label: 'Design'        },
  // ── Add more images below ─────────────────────────────────────
  // { src: '/images/your-render.jpg', alt: 'Project name', label: 'Category' },
]

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNext, onPrev }) {
  const touchStart = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNext, onPrev, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center"
      style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(18px)' }}
      onClick={onClose}
      onTouchStart={e => { touchStart.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStart.current === null) return
        const dx = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(dx) > 44) dx < 0 ? onNext() : onPrev()
        touchStart.current = null
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-30 w-9 h-9 border border-ash/10 flex items-center justify-center text-ash/30 hover:text-ash hover:border-ash/30 transition-all duration-200 text-sm"
        aria-label="Close"
      >✕</button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] text-ash/20 tracking-widest pointer-events-none">
        {String(index + 1).padStart(2, '0')} · {String(images.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      <div
        className="absolute inset-y-0 left-0 w-16 sm:w-24 z-20 flex items-center justify-start pl-4 group cursor-w-resize"
        onClick={e => { e.stopPropagation(); onPrev() }}
      >
        <div className="w-9 h-9 border border-ash/10 group-hover:border-copper/40 flex items-center justify-center text-ash/20 group-hover:text-copper transition-all duration-200 font-mono text-sm">←</div>
      </div>

      {/* Next */}
      <div
        className="absolute inset-y-0 right-0 w-16 sm:w-24 z-20 flex items-center justify-end pr-4 group cursor-e-resize"
        onClick={e => { e.stopPropagation(); onNext() }}
      >
        <div className="w-9 h-9 border border-ash/10 group-hover:border-copper/40 flex items-center justify-center text-ash/20 group-hover:text-copper transition-all duration-200 font-mono text-sm">→</div>
      </div>

      {/* Image */}
      <div
        className="relative z-10 lb-image-enter"
        style={{ maxWidth: '88vw', maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index].src}
          alt={images[index].alt}
          style={{ maxWidth: '88vw', maxHeight: '86vh', objectFit: 'contain', display: 'block' }}
          draggable={false}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: '0 0 0 1px rgba(196,112,63,0.10), 0 40px 100px rgba(0,0,0,0.7)' }} />
      </div>

      {/* Caption */}
      {images[index].alt && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="font-mono text-[0.6rem] text-ash/20 tracking-widest">{images[index].alt}</span>
        </div>
      )}

      {/* Dot strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`View image ${i + 1}`}
            onClick={e => { e.stopPropagation(); /* handled by parent */ }}
            className="transition-all duration-300 rounded-full"
            style={{
              height:     '1px',
              width:      i === index ? '28px' : '10px',
              background: i === index ? '#c4703f' : 'rgba(240,235,227,0.12)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── GallerySection ─────────────────────────────────────────────────────────────
export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeFilter,  setActiveFilter]  = useState('All')
  const [visible,       setVisible]       = useState(false)
  const sectionRef = useRef(null)

  // Derive unique labels for filter tabs
  const labels  = ['All', ...new Set(GALLERY_IMAGES.map(img => img.label).filter(Boolean))]
  const filtered = activeFilter === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.label === activeFilter)

  // Section fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.06 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const openAt  = idx => setLightboxIndex(idx)
  const close   = useCallback(() => setLightboxIndex(null), [])
  const goNext  = useCallback(() => setLightboxIndex(i => (i + 1) % filtered.length), [filtered.length])
  const goPrev  = useCallback(() => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])

  const anim = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : 'translateY(24px)',
    transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <>
      <section id="gallery" ref={sectionRef} className="py-28 sm:py-36 px-6 sm:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">

          {/* ── Label row ── */}
          <div className="flex items-center gap-4 mb-6" style={anim(0)}>
            <span className="section-label">Gallery</span>
            <div className="rule flex-1" />
          </div>

          {/* ── Heading + filter row ── */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6" style={anim(80)}>
            <h2 className="font-display font-light text-4xl sm:text-5xl text-ash leading-tight">
              Renders &amp; <span className="italic text-copper">Work</span>
            </h2>

            {/* Filter tabs */}
            {labels.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {labels.map(l => (
                  <button
                    key={l}
                    onClick={() => { setActiveFilter(l); setLightboxIndex(null) }}
                    className={`px-4 py-1.5 font-mono text-xs tracking-widest uppercase rounded-sm transition-all duration-200 ${
                      activeFilter === l
                        ? 'bg-copper text-ink'
                        : 'border border-ash/10 text-ash/35 hover:border-copper/40 hover:text-copper'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Masonry-style grid ── */}
          <div
            className="columns-2 sm:columns-3 lg:columns-4 gap-2.5 space-y-2.5"
            style={anim(160)}
          >
            {filtered.map((img, i) => (
              <GalleryTile key={img.src + i} img={img} index={i} onClick={() => openAt(i)} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-24 text-center border border-ash/5 rounded-sm">
              <span className="font-mono text-xs text-ash/20 tracking-widest">NO IMAGES IN THIS CATEGORY YET</span>
            </div>
          )}

          {/* ── Count line ── */}
          {filtered.length > 0 && (
            <div className="mt-8 flex items-center gap-4" style={anim(240)}>
              <div className="rule flex-1" />
              <span className="font-mono text-xs text-ash/15 tracking-widest">
                {String(filtered.length).padStart(2,'0')} {filtered.length === 1 ? 'IMAGE' : 'IMAGES'}
              </span>
            </div>
          )}

        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={close}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}

      <style>{`
        @keyframes lbEnter {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .lb-image-enter { animation: lbEnter 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  )
}

// ── Individual tile with lazy-load via IntersectionObserver ───────────────────
function GalleryTile({ img, index, onClick }) {
  const [inView,   setInView]   = useState(false)
  const [loaded,   setLoaded]   = useState(false)
  const tileRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    if (tileRef.current) obs.observe(tileRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={tileRef}
      className="break-inside-avoid mb-2.5 relative overflow-hidden border border-ash/5 group cursor-zoom-in rounded-sm"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'none' : 'translateY(16px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 40}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 40}ms`,
      }}
      onClick={onClick}
    >
      {inView && (
        <Image
          src={img.src}
          alt={img.alt || ''}
          width={600}
          height={450}
          className={`w-full h-auto object-cover transition-all duration-700 ease-out
            group-hover:scale-[1.04] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      )}

      {/* Skeleton while loading */}
      {(!inView || !loaded) && (
        <div className="w-full bg-ink-800 animate-pulse" style={{ aspectRatio: '4/3' }} />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3"
        style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, transparent 55%)' }}>
        <div className="self-end">
          {img.label && (
            <span className="font-mono text-[0.55rem] tracking-widest uppercase text-copper/80 bg-ink/60 px-2 py-0.5 backdrop-blur-sm">
              {img.label}
            </span>
          )}
        </div>
        <p className="font-mono text-[0.6rem] text-ash/60 tracking-wide leading-snug line-clamp-2">
          {img.alt}
        </p>
      </div>

      {/* Index badge */}
      <div className="absolute top-2 left-2 font-mono text-[0.55rem] text-ash/15 tracking-widest">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  )
}
