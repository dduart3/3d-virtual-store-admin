'use client'

import { useRef } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Logo3D() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer ring - thick donut */}
      <mesh castShadow>
        <torusGeometry args={[1, 0.1, 64, 128]} />
        <meshStandardMaterial color='white' metalness={1} roughness={0} />
      </mesh>

      {/* Middle ring */}
      <mesh>
        <torusGeometry args={[0.7, 0.1, 64, 128]} />
        <meshStandardMaterial color='white' metalness={1} roughness={0} />
      </mesh>

      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[0.35, 0.1, 64, 128]} />
        <meshStandardMaterial color='white' metalness={1} roughness={0} />
      </mesh>
    </group>
  )
}

export function Logo() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Environment preset='city' />
        <ambientLight intensity={10} /> {/* Increased ambient light */}
        <pointLight position={[10, 10, 10]} intensity={1.5} />{' '}
        {/* Stronger point light */}
        <Logo3D />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
        />
      </Canvas>
    </div>
  )
}
