import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group } from "three";

interface ProductModelProps {
  modelUrl?: string;
  isDragging: boolean;
  rotationSpeed: number;
  position: number[];
  rotation: number[];
  scale: number;
}

export function ProductModel({ 
  modelUrl, 
  isDragging, 
  rotationSpeed,
  position,
  rotation,
  scale
}: ProductModelProps) {
  const modelRef = useRef<Group>(null);

  // Load the model if URL is provided
  const { scene } = useGLTF(modelUrl || "/models/placeholder.glb");

  // Auto-rotate the model when not being dragged
  useFrame(() => {
    if (modelRef.current) {
      if(!isDragging) {
        modelRef.current.rotation.y += 0.01;
      } else {
        modelRef.current.rotation.y += rotationSpeed;
      }
    }
  });

  return (
    <group 
      ref={modelRef} 
      position={[position[0], position[1], position[2]]} 
      rotation={[rotation[0], rotation[1], rotation[2]]} 
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  );
}
