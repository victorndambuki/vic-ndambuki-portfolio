'use client'

import { useRef, Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Forces the renderer to match the actual container dimensions after mount.
// This is the fix for the "small model" bug after filter switching —
// the canvas sometimes mounts while the card is mid-CSS-transition and
// reads a stale/wrong container size.
function ResizeFix() {
  const { gl, camera, size } = useThree()
  useEffect(() => {
    const container = gl.domElement.parentElement
    if (!container) return
    // Two passes: immediately + after layout fully settles
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
    const t = setTimeout(fix, 120)
    return () => clearTimeout(t)
  }, [gl, camera])
  return null
}

// Auto-fit any GLB to fill the viewer
function GLBModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    const box   = new THREE.Box3().setFromObject(ref.current)
    const size  = new THREE.Vector3()
    box.getSize(size)
    const scale = 2.2 / Math.max(size.x, size.y, size.z)
    ref.current.scale.setScalar(scale)
    const center = new THREE.Vector3()
    box.getCenter(center)
    ref.current.position.sub(center.multiplyScalar(scale))
  }, [scene])

  return <primitive ref={ref} object={scene} />
}

function Loader() {
  const mesh = useRef()
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#c4703f" wireframe />
    </mesh>
  )
}

export default function ModelViewer({ modelPath }) {
  return (
    <div
      className="w-full h-full relative"
      style={{ background: 'linear-gradient(160deg, #f5f0eb 0%, #ede8e0 50%, #e8e2d8 100%)' }}
    >
      {/* Hint */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <span className="font-mono text-xs text-ink/30 tracking-widest">
          DRAG · ROTATE · PINCH/SCROLL TO ZOOM
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 50 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        onContextMenu={e => e.preventDefault()}
        // Resize the renderer whenever its container changes size
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
          autoRotate
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
