import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Background } from "./Background";
import { Environment } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { ProductModel } from "./ProductModel";
import { useProductRotation } from "../hooks/useProductRotation";

interface ViewerSceneProps {
  modelUrl?: string;
  position: number[];
  rotation: number[];
  scale: number;
  showBackground?: boolean;
  useEffects?: boolean;
}

export const ViewerScene = ({
  modelUrl,
  position,
  rotation,
  scale,
  showBackground = true,
  useEffects = true,
}: ViewerSceneProps) => {
  const { isDragging, rotationSpeed } = useProductRotation();
  const { camera } = useThree();

  // Set up the camera for the viewer scene
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group>
      <ambientLight intensity={0.7} />
      {showBackground && <Background position={[0, 0, 3.7]} />}
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, -5]}
        castShadow
      />
      <Environment preset="city" background={false} />

      <ProductModel
        modelUrl={modelUrl}
        position={position}
        rotation={rotation}
        scale={scale}
        isDragging={isDragging} 
        rotationSpeed={rotationSpeed} 
      />
      
      {useEffects && (
        <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.3} />
      </EffectComposer>
      )}
    </group>
  );
};
