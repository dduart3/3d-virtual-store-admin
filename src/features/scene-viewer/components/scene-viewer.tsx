import { Canvas } from "@react-three/fiber"
import { SceneCamera } from "./scene-camera"
import { SceneLighting } from "./scene-lighting"
import { StoreModel } from "./store-model"
import { ReactNode } from "react"
import { Ground } from "./ground"

interface SceneViewerProps {
  children?: ReactNode
  initialCameraPosition?: [number, number, number]
  initialCameraLookAt?: [number, number, number]
}

export default function SceneViewer({
  children,
  initialCameraPosition,
  initialCameraLookAt
}: SceneViewerProps) {  
  
  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ fov: 30 }} 
        shadows
      >
        <SceneCamera 
          initialPosition={initialCameraPosition}
          initialTarget={initialCameraLookAt}
        />
        <SceneLighting />
        <StoreModel />
        <Ground />
        {children}
      </Canvas>
    </div>
  )
}
