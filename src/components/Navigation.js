'use client'

import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'

// ── Sun icon (light mode) ─────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

// ── Moon icon (dark mode) ─────────────────────────────────────────────────────
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

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

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 flex items-center justify-center border border-ash/15 text-ash-400 hover:text-copper hover:border-copper/40 transition-all duration-300"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}

          <a
            href="#contact"
            className="px-5 py-2 border border-copper/50 text-copper font-mono text-xs tracking-widest uppercase hover:bg-copper hover:text-ink transition-all duration-300"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile right-side controls */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 flex items-center justify-center border border-ash/15 text-ash-400 hover:text-copper transition-all duration-300"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}

          {/* Hamburger toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-2">
            <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-ash transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
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
