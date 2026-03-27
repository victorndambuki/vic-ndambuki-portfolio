'use client'

import { useState, useEffect } from 'react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Projects', 'About', 'Gallery', 'Skills', 'Contact']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-ash/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-copper/50 flex items-center justify-center group-hover:border-copper transition-colors duration-300">
            <span className="font-mono text-xs text-copper">VN</span>
          </div>
          <span className="font-display text-ash text-base hidden sm:block tracking-wide">Vic Ndambuki</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-mono text-xs text-ash-400 hover:text-copper tracking-widest uppercase transition-colors duration-300"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="px-5 py-2 border border-copper/50 text-copper font-mono text-xs tracking-widest uppercase hover:bg-copper hover:text-ink transition-all duration-300"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="bg-ink/95 backdrop-blur-md border-t border-ash/5 px-6 py-4 space-y-1">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-mono text-xs text-ash-400 hover:text-copper tracking-widest uppercase border-b border-ash/5 last:border-0 transition-colors"
            >
              {l}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="block w-full text-center py-3 mt-3 border border-copper/50 text-copper font-mono text-xs tracking-widest uppercase">
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  )
}
