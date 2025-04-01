import { useSimpleCamera } from "../hooks/use-camera"

interface SceneCameraProps {
  initialPosition?: [number, number, number]
  initialTarget?: [number, number, number]
}

export function SceneCamera({ 
  initialPosition, 
  initialTarget
}: SceneCameraProps) {
  // Use our camera hook with initial values
  useSimpleCamera(initialPosition, initialTarget)
  
  return null // No need to render anything in the canvas
}
