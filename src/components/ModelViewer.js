'use client'

import { useRef, Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ─── Preload all models so they're ready before the user scrolls to them ──────
useGLTF.preload('/models/phone_stand.glb')
useGLTF.preload('/models/vintage_car_optimized.glb')
useGLTF.preload('/models/ceiling_light_lampshade.glb')
useGLTF.preload('/models/gas_lighter.glb')

// ─── ResizeFix ────────────────────────────────────────────────────────────────
// Keeps the WebGL renderer in sync with its container using ResizeObserver.
// This replaces the fragile single-timeout approach and handles the case where
// the canvas mounts while a CSS transition is in progress (e.g. after filter switch).
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

    // Run immediately, then again after layout settles
    fix()
    const t1 = setTimeout(fix, 50)
    const t2 = setTimeout(fix, 250)

    // Watch for any future size changes (window resize, panel expand, etc.)
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
// THE KEY FIX: useGLTF caches and returns the *same* scene object every time.
// If we mutate it directly (scale / position), those mutations persist in the
// cache. The next time this component mounts (e.g. after a filter switch) it
// gets the already-mutated scene, scales it again → model shrinks, pivot drifts.
//
// Fix: clone the scene on every mount so the cached original is never touched.
function GLBModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()

  // Clone once per mount from the pristine cached scene.
  // useMemo re-runs when `scene` changes (e.g. first load), and is discarded
  // on unmount so the next mount always gets a fresh clone.
  const cloned = useMemo(() => {
    const c = scene.clone(true)   // deep-clone all children & geometries
    // Ensure the clone starts with identity transforms
    c.scale.set(1, 1, 1)
    c.position.set(0, 0, 0)
    c.rotation.set(0, 0, 0)
    return c
  }, [scene])

  useEffect(() => {
    if (!ref.current) return

    // Bounding box is computed BEFORE we apply any scaling so the numbers are
    // in the model's native unit space (no double-scaling risk).
    const box = new THREE.Box3().setFromObject(ref.current)
    const size = new THREE.Vector3()
    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return   // guard against empty / not-yet-loaded scenes

    // Scale so the largest dimension fits within 2.2 world units
    const scale = 2.2 / maxDim
    ref.current.scale.setScalar(scale)

    // Translate so the scaled geometric centre sits exactly at world origin
    // (this also centres the OrbitControls target)
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

// ─── ModelViewer ──────────────────────────────────────────────────────────────
export default function ModelViewer({ modelPath }) {
  const containerRef = useRef(null)
  const [inView, setInView] = useState(false)

  // Pause auto-rotation when the viewer scrolls out of the viewport.
  // This saves significant GPU / CPU on mobile.
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
      {/* Interaction hint */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <span className="font-mono text-xs text-ink/30 tracking-widest">
          DRAG · ROTATE · PINCH/SCROLL TO ZOOM
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 50 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        // Cap pixel ratio: 1x on low-DPR screens, max 2x elsewhere.
        // Avoids rendering at 3x on high-end phones (huge GPU cost for
        // minimal visible improvement on a small screen).
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
          autoRotate={inView}        // ← only spin when visible
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
