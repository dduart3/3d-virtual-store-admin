import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { Group } from 'three'
import { useTransformStore } from '../hooks/use-camera'

interface TransformableModelProps {
  id: string
  modelPath: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
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
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(modelPath)
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate')
  const [isDragging, setIsDragging] = useState(false)
  const setTransforming = useTransformStore(state => state.setTransforming)

  // Clone the scene to avoid sharing materials between instances
  const model = scene.clone()

  // Toggle transform mode with key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return
      
      if (e.key === 'r') {
        setTransformMode('rotate')
      } else if (e.key === 't') {
        setTransformMode('translate')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSelected])

  // Update position and rotation when the transform controls are used
  useFrame(() => {
    if (groupRef.current && isSelected && !isDragging) {
      const currentPosition = groupRef.current.position.toArray() as [number, number, number]
      const currentRotation = [
        groupRef.current.rotation.x,
        groupRef.current.rotation.y,
        groupRef.current.rotation.z
      ] as [number, number, number]

      // Check if position has changed
      if (
        Math.abs(currentPosition[0] - position[0]) > 0.001 ||
        Math.abs(currentPosition[1] - position[1]) > 0.001 ||
        Math.abs(currentPosition[2] - position[2]) > 0.001
      ) {
        onPositionChange?.(id, currentPosition)
      }

      // Check if rotation has changed
      if (
        Math.abs(currentRotation[0] - rotation[0]) > 0.001 ||
        Math.abs(currentRotation[1] - rotation[1]) > 0.001 ||
        Math.abs(currentRotation[2] - rotation[2]) > 0.001
      ) {
        onRotationChange?.(id, currentRotation)
      }
    }
  })

  return (
    <group>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation as [number, number, number]}
        scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.(id)
        }}
        userData={{ type: 'section-model', id }}
      >
        <primitive object={model} />
      </group>

      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          onMouseDown={() => {
            setIsDragging(true)
            setTransforming(true)
          }}
          onMouseUp={() => {
            setIsDragging(false)
            setTransforming(false)
          }}
          onObjectChange={() => {
            if (groupRef.current) {
              const newPosition = groupRef.current.position.toArray() as [number, number, number]
              const newRotation = [
                groupRef.current.rotation.x,
                groupRef.current.rotation.y,
                groupRef.current.rotation.z
              ] as [number, number, number]
              
              onPositionChange?.(id, newPosition)
              onRotationChange?.(id, newRotation)
            }
          }}
        />
      )}
    </group>
  )
}
