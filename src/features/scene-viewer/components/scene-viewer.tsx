import { Canvas } from "@react-three/fiber"
import { SceneCamera } from "./scene-camera"
import { SceneLighting } from "./scene-lighting"
import { StoreModel } from "./store-model"
import { ReactNode, useState, useCallback, useEffect } from "react"
import { Ground } from "./ground"
import { TransformableModel } from "./transformable-model"
import { Environment, OrbitControls } from "@react-three/drei"

// Define the section type based on your codebase
interface SectionModel {
  path: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

interface Section {
  id: string
  name: string
  description: string
  model: SectionModel
}

interface SceneViewerProps {
  children?: ReactNode
  initialCameraPosition?: [number, number, number]
  initialCameraLookAt?: [number, number, number]
  sections?: Section[]
  onSectionPositionChange?: (id: string, position: [number, number, number]) => void
  onSectionRotationChange?: (id: string, rotation: [number, number, number]) => void
  editable?: boolean
  newSectionModel?: {
    modelPath: string
    position: [number, number, number]
  }
}

export default function SceneViewer({
  children,
  initialCameraPosition,
  initialCameraLookAt,
  sections = [],
  onSectionPositionChange,
  onSectionRotationChange,
  editable = true,
  newSectionModel
}: SceneViewerProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  
  const handleSelect = useCallback((id: string) => {
    if (!editable) return
    setSelectedSectionId(id)
  }, [editable])
  
  // Use keyboard events for deselection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Deselect when Escape key is pressed
      if (e.key === 'Escape' && selectedSectionId) {
        setSelectedSectionId(null)
      }
      
      // Alternative: deselect when clicking with Ctrl key pressed
      if (e.key === 'Control') {
        setSelectedSectionId(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSectionId])
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ fov: 30 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Environment preset="dawn"/>
        {initialCameraPosition && initialCameraLookAt ? (
          <SceneCamera
            initialPosition={initialCameraPosition}
            initialTarget={initialCameraLookAt}
          />
        ) : (
          <OrbitControls />
        )}
        <SceneLighting />
        <StoreModel />
        <Ground />
        
        {/* Render existing sections */}
        {sections.map((section) => (
          <TransformableModel
            key={section.id}
            id={section.id}
            modelPath={section.model.path}
            position={section.model.position}
            rotation={section.model.rotation}
            scale={section.model.scale}
            onPositionChange={onSectionPositionChange}
            onRotationChange={onSectionRotationChange}
            onSelect={handleSelect}
            isSelected={selectedSectionId === section.id && editable}
          />
        ))}
        
        {/* Render new section model if provided */}
        {newSectionModel && (
          <TransformableModel
            id="new-section"
            modelPath={newSectionModel.modelPath}
            position={newSectionModel.position}
            onPositionChange={(id, position) => {
              if (onSectionPositionChange) {
                onSectionPositionChange(id, position)
              }
            }}
            onRotationChange={(id, rotation) => {
              if (onSectionRotationChange) {
                onSectionRotationChange(id, rotation)
              }
            }}
            onSelect={handleSelect}
            isSelected={selectedSectionId === "new-section" && editable}
          />
        )}
        
        {children}
      </Canvas>
      
      {editable && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
          <p>Selecciona un modelo para modificarlo</p>
          <p>Tecla T: Modo mover</p>
          <p>Tecla R: Modo rotar</p>
          <p>Tecla CTRL: Deseleccionar modelo</p>
        </div>
      )}
    </div>
  )
}
