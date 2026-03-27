'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

/**
 * ImageGallery
 *
 * Props:
 *   images      – Array<{ src: string, alt?: string }> | string[]
 *   aspectRatio – '4/3' | '16/9' | '1/1' | '3/2'   (default '4/3')
 *   className   – optional extra wrapper class
 */
export default function ImageGallery({ images = [], aspectRatio = '4/3', className = '' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [dragging, setDragging]           = useState(false)
  const [activeDot, setActiveDot]         = useState(0)

  const trackRef      = useRef(null)
  const dragOrigin    = useRef(null)
  const dragScroll    = useRef(0)
  const lbTouchStart  = useRef(null)

  // ── Normalise images ────────────────────────────────────────────────────────
  const imgs = images.map(img =>
    typeof img === 'string' ? { src: img, alt: '' } : img
  )

  // ── Track active dot via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    const track = trackRef.current
    if (!track || imgs.length <= 1) return

    const items = Array.from(track.children)
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveDot(items.indexOf(e.target))
        })
      },
      { root: track, threshold: 0.6 }
    )
    items.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [imgs.length])

  // ── Carousel drag (desktop mouse) ──────────────────────────────────────────
  const onMouseDown = e => {
    const track = trackRef.current
    if (!track) return
    dragOrigin.current = e.pageX - track.offsetLeft
    dragScroll.current = track.scrollLeft
    setDragging(false)
  }

  const onMouseMove = e => {
    const track = trackRef.current
    if (dragOrigin.current === null || !track) return
    const walk = (e.pageX - track.offsetLeft - dragOrigin.current) * 1.4
    if (Math.abs(walk) > 6) setDragging(true)
    track.scrollLeft = dragScroll.current - walk
  }

  const onMouseUp = () => {
    dragOrigin.current = null
  }

  // ── Snap to item by index ───────────────────────────────────────────────────
  const scrollToItem = idx => {
    const track = trackRef.current
    const item  = track?.children[idx]
    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  // ── Lightbox navigation ─────────────────────────────────────────────────────
  const goNext = useCallback(e => {
    e?.stopPropagation()
    setLightboxIndex(i => (i + 1) % imgs.length)
  }, [imgs.length])

  const goPrev = useCallback(e => {
    e?.stopPropagation()
    setLightboxIndex(i => (i - 1 + imgs.length) % imgs.length)
  }, [imgs.length])

  const closeLightbox = () => setLightboxIndex(null)

  // ── Keyboard nav ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = e => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, goNext, goPrev])

  // ── Lock body scroll when lightbox open ────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  // ── Touch swipe inside lightbox ─────────────────────────────────────────────
  const onLbTouchStart = e => { lbTouchStart.current = e.touches[0].clientX }
  const onLbTouchEnd   = e => {
    if (lbTouchStart.current === null) return
    const dx = e.changedTouches[0].clientX - lbTouchStart.current
    if (Math.abs(dx) > 44) dx < 0 ? goNext() : goPrev()
    lbTouchStart.current = null
  }

  // ── Aspect ratio ────────────────────────────────────────────────────────────
  const padMap = { '4/3': '75%', '16/9': '56.25%', '1/1': '100%', '3/2': '66.67%', '21/9': '42.86%' }
  const pad    = padMap[aspectRatio] ?? '75%'

  if (imgs.length === 0) return null

  const single = imgs.length === 1

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          CAROUSEL
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`relative w-full select-none ${className}`}>

        {/* Track */}
        <div
          ref={trackRef}
          className="gallery-track flex gap-2.5 overflow-x-auto px-2 pb-1"
          style={{
            scrollSnapType:         'x mandatory',
            scrollBehavior:         'smooth',
            cursor:                 dragOrigin.current !== null ? 'grabbing' : 'grab',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {imgs.map((img, i) => (
            <div
              key={i}
              className="gallery-item relative flex-shrink-0 overflow-hidden border border-ash/8 rounded-sm group"
              style={{
                scrollSnapAlign: 'center',
                width:           single ? '100%' : 'min(360px, 78vw)',
              }}
              onClick={() => { if (!dragging) setLightboxIndex(i) }}
            >
              {/* Padded aspect-ratio box */}
              <div style={{ position: 'relative', paddingBottom: pad, overflow: 'hidden' }}>
                <Image
                  src={img.src}
                  alt={img.alt || `Photo ${i + 1}`}
                  fill
                  sizes={single ? '100vw' : '(max-width: 768px) 78vw, 360px'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                  draggable={false}
                />
                {/* Copper shimmer on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3"
                  style={{ background: 'linear-gradient(135deg, transparent 60%, rgba(196,112,63,0.15))' }}
                >
                  <span className="font-mono text-[0.6rem] text-copper/70 tracking-widest uppercase bg-ink/70 px-2 py-1 backdrop-blur-sm">
                    {single ? 'Click to expand' : `${String(i + 1).padStart(2,'0')} / ${String(imgs.length).padStart(2,'0')}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot nav (multi-image only) */}
        {!single && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToItem(i)}
                aria-label={`Go to image ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  height:     '1px',
                  width:      activeDot === i ? '24px' : '10px',
                  background: activeDot === i ? '#c4703f' : 'rgba(240,235,227,0.18)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(14px)' }}
          onClick={closeLightbox}
          onTouchStart={onLbTouchStart}
          onTouchEnd={onLbTouchEnd}
        >

          {/* ── Close ── */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 z-20 w-9 h-9 border border-ash/12 flex items-center justify-center text-ash/35 hover:text-ash hover:border-ash/35 transition-all duration-200 text-sm font-light"
          >
            ✕
          </button>

          {/* ── Counter ── */}
          {!single && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] text-ash/25 tracking-widest pointer-events-none">
              {String(lightboxIndex + 1).padStart(2, '0')} · {String(imgs.length).padStart(2, '0')}
            </div>
          )}

          {/* ── Prev / Next hit areas (click left/right half of screen) ── */}
          {!single && (
            <>
              <div
                className="absolute inset-y-0 left-0 w-1/2 z-10 flex items-center pl-4 sm:pl-7 group cursor-w-resize"
                onClick={goPrev}
              >
                <div className="w-10 h-10 border border-ash/10 group-hover:border-copper/40 flex items-center justify-center text-ash/25 group-hover:text-copper transition-all duration-200 font-mono text-sm">
                  ←
                </div>
              </div>
              <div
                className="absolute inset-y-0 right-0 w-1/2 z-10 flex items-center justify-end pr-4 sm:pr-7 group cursor-e-resize"
                onClick={goNext}
              >
                <div className="w-10 h-10 border border-ash/10 group-hover:border-copper/40 flex items-center justify-center text-ash/25 group-hover:text-copper transition-all duration-200 font-mono text-sm">
                  →
                </div>
              </div>
            </>
          )}

          {/* ── Image ── */}
          <div
            className="relative z-10 lb-image-enter"
            style={{ maxWidth: '88vw', maxHeight: '88vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgs[lightboxIndex].src}
              alt={imgs[lightboxIndex].alt || `Image ${lightboxIndex + 1}`}
              style={{
                maxWidth:   '88vw',
                maxHeight:  '88vh',
                objectFit:  'contain',
                display:    'block',
                borderRadius: '1px',
              }}
              draggable={false}
            />

            {/* Thin copper border accent */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: '0 0 0 1px rgba(196,112,63,0.12), 0 32px 80px rgba(0,0,0,0.6)' }} />
          </div>

          {/* ── Alt caption ── */}
          {imgs[lightboxIndex].alt && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none px-8">
              <span className="font-mono text-[0.65rem] text-ash/20 tracking-wide">
                {imgs[lightboxIndex].alt}
              </span>
            </div>
          )}

          {/* ── Dot strip ── */}
          {!single && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  aria-label={`View image ${i + 1}`}
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                  className="transition-all duration-300"
                  style={{
                    height:     '1px',
                    width:      i === lightboxIndex ? '28px' : '10px',
                    background: i === lightboxIndex ? '#c4703f' : 'rgba(240,235,227,0.15)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Shared styles (injected once) ── */}
      <style>{`
        .gallery-track::-webkit-scrollbar { display: none; }
        .gallery-track { -ms-overflow-style: none; scrollbar-width: none; }
        .gallery-item  { cursor: zoom-in; }

        @keyframes lbEnter {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .lb-image-enter { animation: lbEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  )
}
