import { Canvas } from "@react-three/fiber"
import { SceneCamera } from "./scene-camera"
import { SceneLighting } from "./scene-lighting"
import { StoreModel } from "./store-model"
import { ReactNode, useState, useCallback } from "react"
import { Ground } from "./ground"
import { TransformableModel } from "./transformable-model"
import { Environment } from "@react-three/drei"

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
    console.log(id)
    if (!editable) return
    setSelectedSectionId(id)
  }, [editable])
  
  const handleCanvasClick = useCallback((e: any) => {
    // Only deselect if clicking on the canvas background, not on a model
    if (e.object?.type !== 'Mesh' && selectedSectionId) {
      setSelectedSectionId(null)
    }
  }, [selectedSectionId])
  
  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ fov: 30 }} 
        shadows
        onClick={handleCanvasClick}
        gl={{
          antialias: true,
          alpha: true,
              }}
      >
        <Environment preset="dawn"/>
        <SceneCamera 
          initialPosition={initialCameraPosition}
          initialTarget={initialCameraLookAt}
        />
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
            onPositionChange={(_id, position) => {
              if (onSectionPositionChange) {
                onSectionPositionChange("new-section", position)
              }
            }}
            onRotationChange={(_id, rotation) => {
              if (onSectionRotationChange) {
                onSectionRotationChange("new-section", rotation)
              }
            }}
            onSelect={handleSelect}
            isSelected={selectedSectionId === "new-section" && editable}
          />
        )}
        
        {children}
      </Canvas>
    </div>
  )
}
