'use client'

import { useEffect, useRef, useState } from 'react'
import { skills, softwareList } from '../data/projects'

export default function SkillsSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Duplicate list so the infinite loop seams invisibly
  const marqueeItems = [...softwareList, ...softwareList, ...softwareList]

  return (
    <section id="skills" ref={ref} className="py-28 sm:py-36 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">

        {/* Label */}
        <div
          className="flex items-center gap-4 mb-16"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <span className="section-label">Skills & Tools</span>
          <div className="rule flex-1" />
        </div>

        {/* Skill cards */}
        <div className="grid md:grid-cols-3 gap-px bg-ash/5 border border-ash/5 mb-px">
          {skills.map((skill, i) => (
            <div
              key={skill.title}
              className="bg-ink-800 p-8 lg:p-10"
              style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
              }}
            >
              <div className="font-mono text-3xl text-copper/60 mb-6">{skill.icon}</div>
              <h3 className="font-display font-light text-2xl text-ash mb-3">{skill.title}</h3>
              <p className="font-sans font-light text-ash-400 text-sm leading-relaxed mb-6">{skill.description}</p>
              <div className="flex flex-wrap gap-2">
                {skill.tools.map(t => (
                  <span key={t} className="font-mono text-xs text-ash/40 border border-ash/10 px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Infinite marquee strip ── */}
      <div
        className="mt-px bg-ink-800 border-y border-ash/5 py-5 overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}
      >
        {/* Label pinned left — sits above the scroll track on small screens */}
        <div className="px-6 sm:px-12 mb-3">
          <span className="font-mono text-xs text-ash/20 tracking-widest uppercase">
            Software & Tools
          </span>
        </div>

        {/* Scrolling track */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
            style={{ background: 'linear-gradient(to right, #1a1a1a, transparent)' }} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
            style={{ background: 'linear-gradient(to left, #1a1a1a, transparent)' }} />

          <div className="marquee-track">
            {marqueeItems.map((s, i) => (
              <span key={i} className="marquee-item">
                <span className="text-copper/30 mx-3">◈</span>
                <span className="font-mono text-xs text-ash/35 tracking-wide whitespace-nowrap">
                  {s}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
