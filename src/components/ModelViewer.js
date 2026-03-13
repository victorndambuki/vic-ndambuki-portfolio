'use client'

import { useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

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

// Spinning loader cube
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
    <div className="w-full h-full relative" style={{ background: 'linear-gradient(160deg, #2a2420 0%, #1e1a16 50%, #1a1714 100%)' }}>

      {/* Hint */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <span className="font-mono text-xs text-ash-400/50 tracking-widest">
          DRAG · ROTATE · SCROLL TO ZOOM
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        onContextMenu={e => e.preventDefault()}
      >
        {/* Cinematic lighting */}
        <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 4]}   intensity={2.0} color="#fff8f0" castShadow />
          <directionalLight position={[-4, 2, -4]}  intensity={0.8} color="#c4703f" />
          <pointLight       position={[0, -2, 3]}   intensity={0.6} color="#8ab0d0" />
          <spotLight        position={[0, 10, 0]}    intensity={1.2} angle={0.4} penumbra={1} color="#ffffff" />
          <pointLight       position={[3, 0, 2]}    intensity={0.5} color="#fff0e0" />
        <Suspense fallback={<Loader />}>
          {modelPath
            ? <GLBModel path={modelPath} />
            : <Loader />
          }
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
