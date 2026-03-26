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

// ─── Fullscreen icons ─────────────────────────────────────────────────────────
function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3"  y1="21" x2="10" y2="14" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="10" y1="14" x2="3"  y2="21" />
      <line x1="21" y1="3"  x2="14" y2="10" />
    </svg>
  )
}

// ─── ModelViewer ──────────────────────────────────────────────────────────────
export default function ModelViewer({ modelPath }) {
  const containerRef  = useRef(null)
  const [inView, setInView]           = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Pause auto-rotation when scrolled out of view
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

  // Track fullscreen state changes (including Esc key exit)
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement)
      )
    }
    document.addEventListener('fullscreenchange',       onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    document.addEventListener('mozfullscreenchange',    onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange',       onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      document.removeEventListener('mozfullscreenchange',    onFsChange)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    if (!isFullscreen) {
      // Enter fullscreen
      if (el.requestFullscreen)             el.requestFullscreen()
      else if (el.webkitRequestFullscreen)  el.webkitRequestFullscreen()
      else if (el.mozRequestFullScreen)     el.mozRequestFullScreen()
    } else {
      // Exit fullscreen
      if (document.exitFullscreen)            document.exitFullscreen()
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
      else if (document.mozCancelFullScreen)  document.mozCancelFullScreen()
    }
  }, [isFullscreen])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ background: 'linear-gradient(160deg, #f5f0eb 0%, #ede8e0 50%, #e8e2d8 100%)' }}
    >
      {/* Interaction hint */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <span className="font-mono text-xs text-ink/30 tracking-widest">
          DRAG · ROTATE · PINCH/SCROLL TO ZOOM
        </span>
      </div>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'View fullscreen'}
        className="
          absolute top-4 right-4 z-20
          w-8 h-8 flex items-center justify-center
          bg-ink/60 backdrop-blur-sm
          border border-ash/15
          text-ash/60 hover:text-copper hover:border-copper/40
          transition-all duration-200
          rounded-sm
        "
        style={{ pointerEvents: 'auto' }}
      >
        {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
      </button>

      {/* Fullscreen: make canvas fill the entire screen */}
      <style>{`
        :fullscreen #model-canvas-container,
        :-webkit-full-screen #model-canvas-container,
        :-moz-full-screen #model-canvas-container {
          width: 100vw !important;
          height: 100vh !important;
        }
      `}</style>

      <Canvas
        id="model-canvas-container"
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
