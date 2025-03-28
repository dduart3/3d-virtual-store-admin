import { useTexture } from "@react-three/drei"
import { JSX } from "react"

export function Background(props: JSX.IntrinsicElements['mesh']) {
    const texture = useTexture('/textures/background.jpg')
    return (
      <mesh {...props}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    )
  }
  