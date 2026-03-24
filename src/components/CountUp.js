'use client'

import { useEffect, useRef, useState } from 'react'

// Parses "100+" → { num: 100, suffix: '+' }  |  "3+" → { num: 3, suffix: '+' }  |  "100%" → { num: 100, suffix: '%' }
function parse(val) {
  const m = String(val).match(/^(\d+)(.*)$/)
  return m ? { num: parseInt(m[1]), suffix: m[2] } : { num: 0, suffix: String(val) }
}

export default function CountUp({ value, className, duration = 1800 }) {
  const { num, suffix } = parse(value)
  const [display, setDisplay] = useState('0' + suffix)
  const ref     = useRef(null)
  const ran     = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || ran.current) return
      ran.current = true
      obs.disconnect()
      const start = performance.now()
      const tick  = (now) => {
        const p      = Math.min((now - start) / duration, 1)
        const eased  = 1 - Math.pow(1 - p, 4)          // ease-out quart
        setDisplay(Math.round(eased * num) + suffix)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [num, suffix, duration])

  return <span ref={ref} className={className}>{display}</span>
}
