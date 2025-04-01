import { useGLTF } from "@react-three/drei"


export function StoreModel() {
  const { scene } = useGLTF("/models/scene.glb")
  

  
  return <primitive object={scene} />
}
