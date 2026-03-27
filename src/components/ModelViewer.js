'use client'

import { useRef, Suspense, useEffect, useState, useMemo, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ─── Preload all models so they're ready before the user scrolls to them ──────
useGLTF.preload('/models/phone_stand.glb')
useGLTF.preload('/models/vintage_car_optimized.glb')
useGLTF.preload('/models/ceiling_light_lampshade.glb')
useGLTF.preload('/models/gas_lighter.glb')

// ─── ResizeFix ────────────────────────────────────────────────────────────────
function ResizeFix() {
  const { gl, camera } = useThree()

  useEffect(() => {
    const container = gl.domElement.parentElement
    if (!container) return

    const fix = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        gl.setSize(w, h, false)
        if (camera.isPerspectiveCamera) {
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
      }
    }

    fix()
    const t1 = setTimeout(fix, 50)
    const t2 = setTimeout(fix, 250)

    const ro = new ResizeObserver(fix)
    ro.observe(container)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      ro.disconnect()
    }
  }, [gl, camera])

  return null
}

// ─── GLBModel ─────────────────────────────────────────────────────────────────
function GLBModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()

  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.scale.set(1, 1, 1)
    c.position.set(0, 0, 0)
    c.rotation.set(0, 0, 0)
    return c
  }, [scene])

  useEffect(() => {
    if (!ref.current) return

    const box = new THREE.Box3().setFromObject(ref.current)
    const size = new THREE.Vector3()
    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return

    const scale = 2.2 / maxDim
    ref.current.scale.setScalar(scale)

    const center = new THREE.Vector3()
    box.getCenter(center)
    ref.current.position.sub(center.multiplyScalar(scale))
  }, [cloned])

  return <primitive ref={ref} object={cloned} />
}

// ─── Loader placeholder ───────────────────────────────────────────────────────
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#c4703f" wireframe />
    </mesh>
  )
}

// ─── Fullscreen Button ────────────────────────────────────────────────────────
function FullscreenButton({ containerRef }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = useCallback(async () => {
    if (!isFullscreen) {
      try {
        await containerRef.current?.requestFullscreen()
      } catch (err) {
        console.warn('Fullscreen request failed:', err)
      }
    } else {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.warn('Exit fullscreen failed:', err)
      }
    }
  }, [isFullscreen, containerRef])

  return (
    <button
      onClick={toggle}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      style={{
        position:       'absolute',
        bottom:         '12px',
        right:          '12px',
        zIndex:         30,
        display:        'flex',
        alignItems:     'center',
        gap:            '6px',
        padding:        '6px 10px 6px 8px',
        background:     'rgba(13,13,13,0.75)',
        backdropFilter: 'blur(6px)',
        border:         '1px solid rgba(196,112,63,0.35)',
        borderRadius:   '2px',
        color:          '#f0ebe3',
        cursor:         'pointer',
        fontFamily:     '"DM Mono", monospace',
        fontSize:       '0.6rem',
        letterSpacing:  '0.12em',
        textTransform:  'uppercase',
        whiteSpace:     'nowrap',
        transition:     'border-color 0.2s, background 0.2s',
        userSelect:     'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(196,112,63,0.7)'
        e.currentTarget.style.background  = 'rgba(13,13,13,0.92)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(196,112,63,0.35)'
        e.currentTarget.style.background  = 'rgba(13,13,13,0.75)'
      }}
    >
      {/* Icon */}
      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, opacity: 0.85 }}
      >
        {isFullscreen ? (
          /* Exit fullscreen — arrows pointing inward */
          <>
            <path d="M6 2v4H2"    stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 2v4h4"   stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 14v-4H2"  stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14v-4h4" stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        ) : (
          /* Enter fullscreen — arrows pointing outward */
          <>
            <path d="M2 6V2h4"    stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 6V2h-4"  stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10v4h4"   stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10v4h-4" stroke="#c4703f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        )}
      </svg>

      {/* Label */}
      <span style={{ color: '#c4703f' }}>
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </span>
    </button>
  )
}

// ─── ModelViewer ──────────────────────────────────────────────────────────────
export default function ModelViewer({ modelPath }) {
  const containerRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ background: 'linear-gradient(160deg, #f5f0eb 0%, #ede8e0 50%, #e8e2d8 100%)' }}
    >
      {/* Drag/zoom hint — top centre so it doesn't clash with fullscreen btn */}
      <div className="absolute top-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <span className="font-mono text-xs text-ink/30 tracking-widest">
          DRAG · ROTATE · PINCH/SCROLL TO ZOOM
        </span>
      </div>

      {/* Fullscreen toggle button */}
      <FullscreenButton containerRef={containerRef} />

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 50 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
        onContextMenu={e => e.preventDefault()}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <ResizeFix />

        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 8, 4]}   intensity={3.0} color="#fff8f0" castShadow />
        <directionalLight position={[-4, 2, -4]}  intensity={1.5} color="#d4a070" />
        <directionalLight position={[0, -4, 4]}   intensity={1.2} color="#ffffff" />
        <pointLight       position={[3, 0, 2]}    intensity={1.0} color="#fff0e0" />
        <pointLight       position={[-3, 0, 2]}   intensity={1.0} color="#fff0e0" />

        <Suspense fallback={<Loader />}>
          {modelPath ? <GLBModel path={modelPath} /> : <Loader />}
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.6}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={inView}
          autoRotateSpeed={1.2}
          minDistance={2}
          maxDistance={9}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
