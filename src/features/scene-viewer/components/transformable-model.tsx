import { useRef, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { Model } from '@/components/model'
import type { TransformControls as TransformControlsImpl } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'

interface TransformableModelProps {
  id: string
  modelPath: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  onPositionChange?: (id: string, position: [number, number, number]) => void
  onRotationChange?: (id: string, rotation: [number, number, number]) => void
  onSelect?: (id: string) => void
  isSelected?: boolean
}

export function TransformableModel({
  id,
  modelPath,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  onPositionChange,
  onRotationChange,
  onSelect,
  isSelected = false,
}: TransformableModelProps) {
  const modelRef = useRef<THREE.Group>(null)
  const transformRef = useRef<TransformControlsImpl>(null)
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')
  
  // State to track if the model is ready for transform controls
  const [modelReady, setModelReady] = useState(false)
  
  // Store previous position and rotation for comparison
  const prevPosition = useRef<[number, number, number]>(position)
  const prevRotation = useRef<[number, number, number]>(rotation)
  
  // Check if model is ready after it's mounted
  useEffect(() => {
    if (modelRef.current) {
      setModelReady(true)
    }
  }, [])
  
  // Handle keyboard shortcuts for transform mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return
      
      if (e.key === 'r') {
        setMode('rotate')
      } else if (e.key === 'g') {
        setMode('translate')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSelected])
  
  // Use useFrame to detect changes in position and rotation
  useFrame(() => {
    if (!modelRef.current || !isSelected) return
    
    const currentPosition: [number, number, number] = [
      modelRef.current.position.x,
      modelRef.current.position.y,
      modelRef.current.position.z
    ]
    
    const currentRotation: [number, number, number] = [
      modelRef.current.rotation.x,
      modelRef.current.rotation.y,
      modelRef.current.rotation.z
    ]
    
    // Check if position has changed
    if (
      currentPosition[0] !== prevPosition.current[0] ||
      currentPosition[1] !== prevPosition.current[1] ||
      currentPosition[2] !== prevPosition.current[2]
    ) {
      if (onPositionChange) {
        onPositionChange(id, currentPosition)
      }
      prevPosition.current = currentPosition
    }
    
    // Check if rotation has changed
    if (
      currentRotation[0] !== prevRotation.current[0] ||
      currentRotation[1] !== prevRotation.current[1] ||
      currentRotation[2] !== prevRotation.current[2]
    ) {
      if (onRotationChange) {
        onRotationChange(id, currentRotation)
      }
      prevRotation.current = currentRotation
    }
  })
  
  return (
    <>
      <group
        ref={modelRef}
        position={new THREE.Vector3(...position)}
        rotation={new THREE.Euler(...rotation)}
        onClick={(e) => {
          e.stopPropagation()
          if (onSelect) onSelect(id)
        }}
      >
        <Model
          modelPath={modelPath}
          scale={scale}
        />
      </group>
      
      {isSelected && modelReady && modelRef.current && (
        <TransformControls
          ref={transformRef}
          object={modelRef.current}
          mode={mode}
          size={0.75}
          showX={true}
          showY={true}
          showZ={true}
        />
      )}
    </>
  )
}
