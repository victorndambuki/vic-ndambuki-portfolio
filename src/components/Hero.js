'use client'

import { useEffect, useRef, useState } from 'react'
import CountUp from './CountUp'

export default function Hero() {
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef(null)

  // Staggered reveal phases
  useEffect(() => {
    const timings = [100, 400, 900, 1400, 1900, 2400]
    timings.forEach((t, i) => setTimeout(() => setPhase(i + 1), t))
  }, [])

  // Animated ambient mesh background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { x: 0.15, y: 0.3,  r: 0.45, hue: 30,  speed: 0.0003 },
      { x: 0.85, y: 0.6,  r: 0.40, hue: 20,  speed: 0.0004 },
      { x: 0.5,  y: 0.85, r: 0.35, hue: 10,  speed: 0.0002 },
    ]

    const draw = () => {
      t += 1
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      orbs.forEach(o => {
        const ox = (o.x + Math.sin(t * o.speed * 1.1) * 0.08) * W
        const oy = (o.y + Math.cos(t * o.speed) * 0.06) * H
        const r  = o.r * Math.max(W, H)
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, r)
        g.addColorStop(0,   `hsla(${o.hue}, 60%, 35%, 0.12)`)
        g.addColorStop(0.5, `hsla(${o.hue}, 50%, 20%, 0.05)`)
        g.addColorStop(1,   `hsla(${o.hue}, 40%, 10%, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  const show = (n) => phase >= n

  const stats = [
    { num: '100+', label: 'Projects Completed' },
    { num: '3+',   label: 'Years Experience' },
    { num: '3',    label: 'Core Disciplines' },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink noise">
      {/* Ambient mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Thin horizontal accent line */}
      <div
        className="absolute top-0 left-0 h-px bg-copper origin-left"
        style={{
          width: '100%',
          transform: show(1) ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 w-full">

        {/* Label */}
        <div
          className="section-label mb-10 flex items-center gap-4"
          style={{ opacity: show(1) ? 1 : 0, transform: show(1) ? 'none' : 'translateY(12px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}
        >
          <span className="w-8 h-px bg-copper inline-block" />
          Mechanical Engineer · Nairobi, Kenya
        </div>

        {/* Main headline */}
        <h1 className="font-display font-light leading-[0.92] mb-8">
          <WordReveal text="Vic"      size="text-[13vw] sm:text-[11vw] md:text-[10vw]" delay={0}   show={show(2)} />
          <br />
          <WordReveal text="Ndambuki" size="text-[13vw] sm:text-[11vw] md:text-[10vw]" delay={120} show={show(2)} italic />
        </h1>

        {/* Descriptor row */}
        <div
          className="flex flex-wrap items-center gap-3 mb-10"
          style={{ opacity: show(3) ? 1 : 0, transform: show(3) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
        >
          {['Laser Cutting', 'CAD Design', '3D Printing'].map((s) => (
            <span key={s} className="tag tag-laser">{s}</span>
          ))}
        </div>

        {/* Subheading */}
        <p
          className="font-sans font-light text-ash-400 text-base sm:text-lg max-w-xl leading-relaxed mb-14"
          style={{ opacity: show(4) ? 1 : 0, transform: show(4) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
        >
          Precision Computer Aided Design, laser cutting & 3D printing.
          <br />Turning ideas into functional, fabricated reality.
        </p>

        {/* CTA row */}
        <div
          className="flex flex-wrap gap-4"
          style={{ opacity: show(5) ? 1 : 0, transform: show(5) ? 'none' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <a
            href="#projects"
            className="group flex items-center gap-3 px-8 py-3.5 bg-copper text-ink font-sans font-medium text-sm rounded-sm hover:bg-copper-light transition-colors duration-300"
          >
            View Work
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-3 px-8 py-3.5 border border-ash-400/30 text-ash font-sans font-light text-sm rounded-sm hover:border-copper/60 hover:text-copper transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* ── Animated stats ── */}
        <div
          className="flex gap-12 sm:gap-20 mt-20 pt-8 border-t border-ash/5"
          style={{ opacity: show(6) ? 1 : 0, transition: 'opacity 1.2s ease 0.2s' }}
        >
          {stats.map(s => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-4xl font-light text-copper">
                <CountUp value={s.num} />
              </div>
              <div className="font-mono text-xs text-ash-400 mt-1 tracking-wider">{s.label}</div>
            </div>
          ))}
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

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(196,112,63,0.3), transparent)' }} />
    </section>
  )
}

function WordReveal({ text, size, delay, show, italic }) {
  return (
    <span
      className={`inline-block ${size} ${italic ? 'italic text-copper' : 'text-ash'}`}
      style={{
        opacity:    show ? 1 : 0,
        transform:  show ? 'translateY(0) rotate(0deg)' : 'translateY(80px) rotate(2deg)',
        transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {text}
    </span>
  )
}
