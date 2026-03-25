'use client'

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    // Only activate on fine-pointer (desktop) devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = document.getElementById('c-dot')
    const ring = document.getElementById('c-ring')
    if (!dot || !ring) return

    // Start far offscreen so they never flash at 0,0
    let mx = -1000, my = -1000
    let rx = -1000, ry = -1000
    let raf

    const onMove = (e) => { mx = e.clientX; my = e.clientY }

    const animate = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`
      raf = requestAnimationFrame(animate)
    }

    // Grow ring on interactive elements
    const grow   = () => ring.classList.add('c-ring-grow')
    const shrink = () => ring.classList.remove('c-ring-grow')
    const targets = document.querySelectorAll('a, button, canvas, [role="button"]')
    targets.forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    window.addEventListener('mousemove', onMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        id="c-dot"
        aria-hidden="true"
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         6,
          height:        6,
          borderRadius:  '50%',
          background:    '#c4703f',
          pointerEvents: 'none',
          zIndex:        9999,
          willChange:    'transform',
          // Hidden on touch/mobile via CSS — JS also gates activation above
          display:       'var(--cursor-display, none)',
        }}
      />
      <div
        id="c-ring"
        aria-hidden="true"
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         36,
          height:        36,
          borderRadius:  '50%',
          border:        '1px solid rgba(196,112,63,0.55)',
          pointerEvents: 'none',
          zIndex:        9998,
          willChange:    'transform',
          transition:    'width 0.25s, height 0.25s, border-color 0.25s',
          display:       'var(--cursor-display, none)',
        }}
      />
    </>
  )
}
