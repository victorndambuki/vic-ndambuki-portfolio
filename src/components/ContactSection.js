'use client'

import { useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// SETUP (one-time):
//   1. Go to https://formspree.io and create a free account
//   2. Create a new form → copy the form ID (looks like "xpwzgkrb")
//   3. Replace YOUR_FORM_ID below with your actual ID
// ─────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ID = 'YOUR_FORM_ID'

const INITIAL = { name: '', email: '', message: '' }

export default function ContactSection() {
  const [visible, setVisible]   = useState(false)
  const [fields,  setFields]    = useState(INITIAL)
  const [status,  setStatus]    = useState('idle') // idle | sending | success | error
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const set = (key) => (e) => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(fields),
      })
      if (res.ok) { setStatus('success'); setFields(INITIAL) }
      else        { setStatus('error') }
    } catch {
      setStatus('error')
    }
  }

  const anim = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : 'translateY(20px)',
    transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  const inputCls = `
    w-full bg-ink border border-ash/10 px-4 py-3.5
    font-sans font-light text-sm text-ash placeholder-ash/20
    focus:outline-none focus:border-copper/50
    transition-colors duration-300 rounded-sm
  `

  return (
    <section id="contact" ref={ref} className="py-28 sm:py-40 px-6 sm:px-12 bg-surface relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(196,112,63,0.06), transparent)' }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-4 mb-16" style={anim(0)}>
          <span className="section-label">Contact</span>
          <div className="rule flex-1" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left: headline + links ── */}
          <div>
            <h2
              className="font-display font-light text-5xl sm:text-6xl lg:text-7xl text-ash leading-tight mb-8"
              style={anim(100)}
            >
              Have a Project<br />
              <span className="italic text-copper">in Mind?</span>
            </h2>

            <p className="font-sans font-light text-ash-400 text-base leading-relaxed mb-10" style={anim(200)}>
              Whether you need custom laser-cut parts, 3D-printed prototypes, or full CAD design work — let&apos;s bring your ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4" style={anim(300)}>
              <a
                href="mailto:ndambukivic@gmail.com"
                className="group flex items-center justify-center gap-3 px-7 py-3.5 border border-ash/15 text-ash font-sans font-light text-sm hover:border-copper/50 hover:text-copper transition-all duration-300"
              >
                ✉ ndambukivic@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/vicndambukicswa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-7 py-3.5 border border-ash/15 text-ash font-sans font-light text-sm hover:border-copper/50 hover:text-copper transition-all duration-300"
              >
                🔗 LinkedIn
              </a>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div style={anim(200)}>
            {status === 'success' ? (
              <div className="border border-copper/20 bg-copper/5 p-10 text-center rounded-sm">
                <div className="font-display text-4xl text-copper mb-4">✓</div>
                <p className="font-sans font-light text-ash text-base mb-2">Message sent!</p>
                <p className="font-mono text-xs text-ash/30 tracking-wide">I&apos;ll get back to you shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 font-mono text-xs text-copper/60 hover:text-copper tracking-widest underline underline-offset-4 transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-ash/30 tracking-widest mb-2 block">NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={fields.name}
                      onChange={set('name')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-ash/30 tracking-widest mb-2 block">EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={fields.email}
                      onChange={set('email')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-ash/30 tracking-widest mb-2 block">MESSAGE</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project — materials, quantities, timeline..."
                    value={fields.message}
                    onChange={set('message')}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                {status === 'error' && (
                  <p className="font-mono text-xs text-red-400 tracking-wide">
                    Something went wrong. Please email directly at ndambukivic@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 bg-copper text-ink font-sans font-medium text-sm hover:bg-copper-light transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>

                <p className="font-mono text-xs text-ash/15 text-center tracking-wide">
                  Typically responds within 24 hours
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
