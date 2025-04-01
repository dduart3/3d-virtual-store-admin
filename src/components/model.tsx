import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

interface ModelProps {
  modelPath: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  isCritical?: boolean
}

export function Model({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: ModelProps) {
  // Load the model with useGLTF
  const { scene } = useGLTF(modelPath)
  
  // Apply scale and shadows
  useEffect(() => {
    if (scene) {
      // Apply scale
      if (typeof scale === 'number') {
        scene.scale.set(scale, scale, scale)
      } else {
        scene.scale.set(scale[0], scale[1], scale[2])
      }
      
      // Enable shadows
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene, scale])
  

  
  return (
    <primitive 
      object={scene.clone()} 
      position={position}
      rotation={rotation}
    />
  )
}
