import { useTexture } from "@react-three/drei";
import { JSX } from "react";
import { RepeatWrapping } from "three";

export const Ground = (props: JSX.IntrinsicElements['mesh']) => {
  const floorTexture = useTexture("/textures/concrete.jpg");
  // Make the texture repeat
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  return (
      <mesh
        {...props}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-165, -0.5, -60]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
  );
};
