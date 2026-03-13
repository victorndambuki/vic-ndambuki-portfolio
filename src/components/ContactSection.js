'use client'

import { useEffect, useRef, useState } from 'react'

export default function ContactSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref} className="py-28 sm:py-40 px-6 sm:px-12 bg-surface relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(196,112,63,0.06), transparent)' }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-4 mb-16"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          <span className="section-label">Contact</span>
          <div className="rule flex-1" />
        </div>

        <div className="max-w-2xl">
          <h2
            className="font-display font-light text-5xl sm:text-6xl lg:text-7xl text-ash leading-tight mb-8"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}
          >
            Have a Project<br />
            <span className="italic text-copper">in Mind?</span>
          </h2>

          <p
            className="font-sans font-light text-ash-400 text-base leading-relaxed mb-12"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s' }}
          >
            Whether you need custom laser-cut parts, 3D-printed prototypes, or full CAD design work — let&apos;s bring your ideas to life.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s' }}
          >
            <a
              href="mailto:ndambukivic@gmail.com"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-copper text-ink font-sans font-medium text-sm hover:bg-copper-light transition-colors duration-300"
            >
              ✉ Email Vic
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
            <a
              href="https://www.linkedin.com/in/vicndambukicswa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 border border-ash/20 text-ash font-sans font-light text-sm hover:border-copper/50 hover:text-copper transition-all duration-300"
            >
              🔗 LinkedIn Profile
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
