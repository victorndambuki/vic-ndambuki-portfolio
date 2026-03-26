'use client'

import { useEffect, useRef, useState } from 'react'
import CountUp from './CountUp'

const EXPERIENCE_BARS = [
  { label: 'CAD & 3D Modelling',          pct: 90 },
  { label: 'Laser Cutting & Fabrication', pct: 85 },
  { label: '3D Printing & Prototyping',   pct: 80 },
  { label: 'Design for Manufacture',      pct: 85 },
]

export default function AboutSection() {
  const [visible, setVisible]   = useState(false)
  const [barsOn, setBarsOn]     = useState(false)
  const sectionRef = useRef(null)
  const barsRef    = useRef(null)

  useEffect(() => {
    const secObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    const barObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarsOn(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) secObs.observe(sectionRef.current)
    if (barsRef.current)    barObs.observe(barsRef.current)
    return () => { secObs.disconnect(); barObs.disconnect() }
  }, [])

  const anim = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  const stats = [
    { num: '100+', label: 'Laser Projects' },
    { num: '30+',  label: '3D Print Projects' },
    { num: '3+',   label: 'Years Experience' },
    { num: '100%', label: 'Quality Focus' },
  ]

  const info = [
    { label: 'Based in',      value: 'Nairobi, Kenya' },
    { label: 'Discipline',    value: 'Mechanical Engineering' },
    { label: 'Speciality',    value: '2D & 3D Design, Laser & 3D Printing' },
    { label: 'Primary Tools', value: 'SolidWorks, AutoCAD, CypCut, LightBurn, OrcaSlicer' },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-28 sm:py-36 px-6 sm:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16" style={anim(0)}>
          <span className="section-label">About</span>
          <div className="rule flex-1" />
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* ── Photo column ── */}
          <div className="lg:col-span-2" style={anim(100)}>
            <div className="relative mb-6">
              <div className="aspect-[3/4] bg-ink-800 border border-ash/5 overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/vic-profile.jpg"
                  alt="Vic Ndambuki"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Corner accents */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b border-r border-copper/40" />
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t border-l border-copper/20" />
            </div>

            {/* Info card */}
            <div className="border border-ash/5 p-6 space-y-1">
              {info.map(item => (
                <div key={item.label} className="flex gap-4 py-2.5 border-b border-ash/4 last:border-0">
                  <span className="font-mono text-xs text-ash/25 w-28 flex-shrink-0 tracking-wide pt-0.5">
                    {item.label}
                  </span>
                  <span className="font-sans font-light text-ash-300 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Text column ── */}
          <div className="lg:col-span-3 space-y-10">

            <h2
              className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-ash leading-tight"
              style={anim(150)}
            >
              Engineering Problems,<br />
              <span className="italic text-copper">Creative Solutions.</span>
            </h2>

            <div className="space-y-5 font-sans font-light text-ash-400 text-base leading-relaxed" style={anim(250)}>
              <p>
                I&apos;m Vic Ndambuki, a Graduate Mechanical Engineer passionate about turning ideas into physical reality. With deep expertise in CAD modelling, laser cutting, and 3D printing, I bridge the gap between digital design and fabricated components.
              </p>
              <p>
                My work spans automotive accessories, mechanical components, decorative fabrication, and functional prototypes — always balancing performance with aesthetics. Every project starts with understanding the problem, not just jumping to a solution.
              </p>
              <p>
                A Mechanical Engineering graduate from the Technical University of Kenya, with over three years of industry experience, driven by a commitment to continuous improvement and the principles of Kaizen.
              </p>
            </div>

            {/* ── Experience bars (new) ── */}
            <div ref={barsRef} style={anim(300)}>
              <p className="font-mono text-xs text-ash/25 tracking-widest uppercase mb-5">
                Core Proficiencies
              </p>
              <div className="space-y-5">
                {EXPERIENCE_BARS.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-mono text-xs text-ash-400 tracking-wide">{label}</span>
                      <span className="font-mono text-xs text-copper">{pct}%</span>
                    </div>
                    <div className="h-px bg-ash/6 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      barsOn ? `${pct}%` : '0%',
                          background: 'linear-gradient(to right, #a05530, #c4703f)',
                          transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Stats grid ── */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ash/5 border border-ash/5"
              style={anim(400)}
            >
              {stats.map(item => (
                <div key={item.label} className="bg-ink-800 p-6 text-center">
                  <div className="font-display text-3xl font-light text-copper mb-1">
                    <CountUp value={item.num} />
                  </div>
                  <div className="font-mono text-xs text-ash/25 tracking-wide">{item.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4" style={anim(500)}>
              <a
                href="#projects"
                className="group px-7 py-3 bg-copper text-ink font-sans font-medium text-sm rounded-sm hover:bg-copper-light transition-colors duration-300 flex items-center gap-2"
              >
                View Projects
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
              <a
                href="#contact"
                className="px-7 py-3 border border-ash/20 text-ash font-sans font-light text-sm rounded-sm hover:border-copper/50 hover:text-copper transition-all duration-300"
              >
                Contact Me
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
