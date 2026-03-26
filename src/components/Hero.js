'use client'

import { useEffect, useRef, useState } from 'react'
import CountUp from './CountUp'

export default function Hero() {
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const timings = [100, 400, 900, 1400, 1900, 2400]
    timings.forEach((t, i) => setTimeout(() => setPhase(i + 1), t))
  }, [])

  // Ambient orb canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, t = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const orbs = [
      { x: 0.12, y: 0.3,  r: 0.45, hue: 30,  speed: 0.0003 },
      { x: 0.88, y: 0.65, r: 0.40, hue: 20,  speed: 0.0004 },
      { x: 0.5,  y: 0.9,  r: 0.35, hue: 10,  speed: 0.0002 },
    ]
    const draw = () => {
      t++
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      orbs.forEach(o => {
        const ox = (o.x + Math.sin(t * o.speed * 1.1) * 0.08) * W
        const oy = (o.y + Math.cos(t * o.speed) * 0.06) * H
        const r  = o.r * Math.max(W, H)
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, r)
        g.addColorStop(0,   `hsla(${o.hue},60%,35%,0.10)`)
        g.addColorStop(0.5, `hsla(${o.hue},50%,20%,0.04)`)
        g.addColorStop(1,   `hsla(${o.hue},40%,10%,0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  const show = (n) => phase >= n
  const anim = (show, delay = 0) => ({
    opacity:   show ? 1 : 0,
    transform: show ? 'translateY(0) rotate(0deg)' : 'translateY(60px) rotate(1deg)',
    transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  const stats = [
    { num: '100+', label: 'Projects Completed' },
    { num: '3+',   label: 'Years Experience' },
    { num: '3',    label: 'Core Disciplines' },
  ]

  const engInfo = [
    { key: 'Status',   val: 'Available' },
    { key: 'Location', val: 'Nairobi, KE' },
    { key: 'Expertise',val: 'CAD · Laser · 3DP' },
    { key: 'Response', val: '< 24 hrs' },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink noise">
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,112,63,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,112,63,0.04) 1px, transparent 1px),
            linear-gradient(rgba(196,112,63,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,112,63,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
        }}
      />

      {/* Ambient canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-px bg-copper origin-left"
        style={{
          width: '100%',
          transform: show(1) ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Engineering corner markers */}
      {[
        'top-[80px] left-10 border-t border-l',
        'top-[80px] right-10 border-t border-r',
        'bottom-10 left-10 border-b border-l',
        'bottom-10 right-10 border-b border-r',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-12 h-12 border-copper/20 pointer-events-none hidden sm:block ${cls}`}
          style={{ opacity: show(1) ? 1 : 0, transition: 'opacity 1s ease 0.8s' }}
        />
      ))}

      {/* Vertical measurement line */}
      <div
        className="absolute left-10 top-36 bottom-20 w-px pointer-events-none hidden lg:block"
        style={{
          background: 'linear-gradient(to bottom, rgba(196,112,63,0.15), rgba(196,112,63,0.04), transparent)',
          transform: show(1) ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s',
        }}
      >
        <span
          className="absolute left-3 top-1/2 font-mono text-[0.5rem] text-copper/25 tracking-[0.15em] whitespace-nowrap"
          style={{ transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'left center' }}
        >
          MECHANICAL · ENGINEER
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">

          {/* Left */}
          <div className="max-w-3xl">
            {/* Label */}
            <div
              className="flex items-center gap-4 mb-10"
              style={{ opacity: show(1) ? 1 : 0, transform: show(1) ? 'none' : 'translateY(12px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}
            >
              <span className="w-8 h-px bg-copper inline-block flex-shrink-0" />
              <span className="section-label">Mechanical Engineer · Nairobi, Kenya</span>
            </div>

            {/* Name */}
            <h1 className="font-display font-light leading-[0.9] mb-8">
              <span
                className="block text-ash"
                style={{ fontSize: 'clamp(72px, 12vw, 152px)', ...anim(show(2), 0) }}
              >
                Vic
              </span>
              <span
                className="block text-copper italic"
                style={{ fontSize: 'clamp(72px, 12vw, 152px)', ...anim(show(2), 120) }}
              >
                Ndambuki
              </span>
            </h1>

            {/* Tags */}
            <div
              className="flex flex-wrap items-center gap-2 mb-8"
              style={{ opacity: show(3) ? 1 : 0, transform: show(3) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
            >
              {['Laser Cutting', 'CAD Design', '3D Printing'].map(s => (
                <span key={s} className="tag tag-laser">{s}</span>
              ))}
            </div>

            {/* Sub */}
            <p
              className="font-sans font-light text-ash-400 text-base sm:text-lg max-w-xl leading-relaxed mb-14"
              style={{ opacity: show(4) ? 1 : 0, transform: show(4) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
            >
              Precision Computer Aided Design, laser cutting &amp; 3D printing.
              <br />Turning ideas into functional, fabricated reality.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4"
              style={{ opacity: show(5) ? 1 : 0, transform: show(5) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
            >
              <a
                href="#projects"
                className="group flex items-center gap-3 px-8 py-3.5 bg-copper text-ink font-sans font-medium text-sm rounded-sm hover:bg-copper-light transition-all duration-300"
              >
                View Work
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 px-8 py-3.5 border border-ash-400/20 text-ash font-sans font-light text-sm rounded-sm hover:border-copper/50 hover:text-copper transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex gap-12 sm:gap-20 mt-20 pt-8 border-t border-ash/5"
              style={{ opacity: show(6) ? 1 : 0, transition: 'opacity 1.2s ease 0.2s' }}
            >
              {stats.map(s => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-light text-copper">
                    <CountUp value={s.num} />
                  </div>
                  <div className="font-mono text-xs text-ash-400 mt-2 tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Engineering info card — hidden on mobile */}
          <div
            className="hidden lg:flex flex-col items-end gap-5"
            style={{ opacity: show(6) ? 1 : 0, transition: 'opacity 1.2s ease 1.2s' }}
          >
            {/* Rotating badge */}
            <div className="relative w-40 h-40">
              <div
                className="w-full h-full border border-copper/15 rounded-full absolute"
                style={{ animation: 'spin 30s linear infinite' }}
              >
                <div className="absolute inset-1.5 border border-dashed border-copper/8 rounded-full" />
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-copper"
                  style={{ boxShadow: '0 0 8px rgba(196,112,63,0.5)' }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl text-copper/35">◈</span>
                <span className="font-mono text-[0.45rem] text-copper/35 tracking-[0.2em] uppercase">Fabrication</span>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-ink-800 border border-ash/5 p-5 min-w-[180px]">
              {engInfo.map(item => (
                <div key={item.key} className="flex justify-between items-center py-2.5 border-b border-ash/4 last:border-0">
                  <span className="font-mono text-[0.55rem] text-ash/20 tracking-[0.12em]">{item.key}</span>
                  <span className="font-mono text-[0.6rem] text-copper">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: show(6) ? 1 : 0, transition: 'opacity 1s ease 0.4s' }}
      >
        <div className="w-px h-14 bg-gradient-to-b from-copper to-transparent animate-pulse" />
        <span className="font-mono text-xs text-ash-400 tracking-widest">SCROLL</span>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(196,112,63,0.3), transparent)' }} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
