'use client'

import { useEffect, useRef, useState } from 'react'
import { skills, softwareList } from '../data/projects'

export default function SkillsSection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const marqueeItems = [...softwareList, ...softwareList, ...softwareList]

  return (
    <section id="skills" ref={sectionRef} className="py-28 sm:py-36 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">

        {/* Label */}
        <div
          className="flex items-center gap-4 mb-16"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <span className="section-label">Skills &amp; Tools</span>
          <div className="rule flex-1" />
        </div>

        {/* Skill cards */}
        <div className="grid md:grid-cols-3 gap-px bg-ash/5 border border-ash/5 mb-px">
          {skills.map((skill, i) => (
            <div
              key={skill.title}
              className="group bg-ink-800 p-8 lg:p-10 relative overflow-hidden transition-colors duration-400 hover:bg-ink-700"
              style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms,
                             transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms,
                             background-color 0.4s`,
              }}
            >
              {/* Left reveal border */}
              <div
                className="absolute top-0 left-0 w-0.5 bg-copper"
                style={{
                  height:     '0%',
                  transition: 'height 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
                ref={el => {
                  if (!el) return
                  const card = el.parentElement
                  card.addEventListener('mouseenter', () => el.style.height = '100%')
                  card.addEventListener('mouseleave', () => el.style.height = '0%')
                }}
              />

              <div className="font-mono text-3xl text-copper/50 mb-6 transition-colors duration-300 group-hover:text-copper/80">
                {skill.icon}
              </div>

              <h3 className="font-display font-light text-2xl text-ash mb-3">{skill.title}</h3>
              <p className="font-sans font-light text-ash-400 text-sm leading-relaxed mb-6">{skill.description}</p>

              {/* Tool pills */}
              <div className="flex flex-wrap gap-2">
                {skill.tools.map(t => (
                  <span
                    key={t}
                    className="font-mono text-xs text-ash/35 border border-ash/8 px-2.5 py-1 transition-all duration-250 group-hover:border-copper/15 group-hover:text-ash/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  Marquee strip  */}
      <div
        className="mt-px bg-ink-800 border-y border-ash/5 py-5 overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}
      >
        <div className="px-6 sm:px-12 mb-3">
          <span className="font-mono text-xs text-ash/15 tracking-widest uppercase">Software &amp; Tools</span>
        </div>
        <div className="relative">
          {/* Fade edges — use CSS classes so they react to theme */}
          <div className="marquee-fade-left pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10" />
          <div className="marquee-fade-right pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10" />
          <div className="marquee-track">
            {marqueeItems.map((s, i) => (
              <span key={i} className="marquee-item">
                <span className="text-copper/25 mx-3"></span>
                <span className="font-mono text-xs text-ash/30 tracking-wide whitespace-nowrap">{s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
