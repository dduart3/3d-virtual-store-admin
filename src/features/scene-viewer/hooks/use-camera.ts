import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export function useSimpleCamera(initialPosition?: [number, number, number], initialTarget?: [number, number, number]) {
  const { camera, gl } = useThree()
  
  // Camera control sensitivity constants
  const PAN_SPEED = 0.05
  const ROTATION_SPEED = 0.005
  const ZOOM_SPEED = 1
  
  // Simple camera state
  const state = useRef({
    // Camera position and target
    position: initialPosition 
      ? new THREE.Vector3(...initialPosition) 
      : new THREE.Vector3(-147.74, 35.37, -76.92),
    target: initialTarget 
      ? new THREE.Vector3(...initialTarget) 
      : new THREE.Vector3(-147.55, 10, -64.23),
    
    // Mouse state
    isLeftDragging: false,
    isRightDragging: false,
    lastX: 0,
    lastY: 0
  })
  
  // Initialize camera
  useEffect(() => {
    camera.position.copy(state.current.position)
    camera.lookAt(state.current.target)
    
    // Add debug key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        // Log camera info to console
        console.log('Camera Position:', {
          x: camera.position.x.toFixed(2),
          y: camera.position.y.toFixed(2),
          z: camera.position.z.toFixed(2)
        })
        console.log('Camera Target:', {
          x: state.current.target.x.toFixed(2),
          y: state.current.target.y.toFixed(2),
          z: state.current.target.z.toFixed(2)
        })
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera])
  
  // Set up event handlers
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        state.current.isLeftDragging = true
      } else if (event.button === 2) {
        state.current.isRightDragging = true
      }
      
      state.current.lastX = event.clientX
      state.current.lastY = event.clientY
    }
    
    const onMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        state.current.isLeftDragging = false
      } else if (event.button === 2) {
        state.current.isRightDragging = false
      }
    }
    
    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - state.current.lastX
      const deltaY = event.clientY - state.current.lastY
      state.current.lastX = event.clientX
      state.current.lastY = event.clientY
      
      // Handle left-drag (pan)
      if (state.current.isLeftDragging) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
        forward.y = 0
        forward.normalize()
        
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        right.y = 0
        right.normalize()
        
        // For proper inverted movement in both directions:
        // 1. When moving mouse right, we want camera to move left (-deltaX)
        // 2. When moving mouse down, we want camera to move up (-deltaY)
        const moveX = right.clone().multiplyScalar(-deltaX * PAN_SPEED)  // Inverted X
        const moveZ = forward.clone().multiplyScalar(deltaY * PAN_SPEED) // Regular Y (since forward is already negative Z)
        
        state.current.position.add(moveX).add(moveZ)
        state.current.target.add(moveX).add(moveZ)
        
        camera.position.copy(state.current.position)
        camera.lookAt(state.current.target)
      }
      
      // Handle right-drag (rotate)
      if (state.current.isRightDragging) {
        // For inverted rotation (opposite of mouse movement)
        const rotateAngle = -deltaX * ROTATION_SPEED
        
        const offset = new THREE.Vector3(
          state.current.position.x - state.current.target.x,
          0,
          state.current.position.z - state.current.target.z
        )
        
        const rotationMatrix = new THREE.Matrix4().makeRotationY(rotateAngle)
        offset.applyMatrix4(rotationMatrix)
        
        const newPosition = new THREE.Vector3(
          state.current.target.x + offset.x,
          state.current.position.y,
          state.current.target.z + offset.z
        )
        
        state.current.position.copy(newPosition)
        camera.position.copy(newPosition)
        camera.lookAt(state.current.target)
      }
    }
    
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      const direction = new THREE.Vector3()
        .subVectors(state.current.target, state.current.position)
        .normalize()
      
      const zoomAmount = event.deltaY > 0 ? -1 : 1
      
      const newPosition = state.current.position.clone()
        .add(direction.multiplyScalar(zoomAmount * ZOOM_SPEED))
      
      state.current.position.copy(newPosition)
      camera.position.copy(newPosition)
    }
    
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }
    
    gl.domElement.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    gl.domElement.addEventListener('wheel', onWheel, { passive: false })
    gl.domElement.addEventListener('contextmenu', onContextMenu)
    
    return () => {
      gl.domElement.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      gl.domElement.removeEventListener('wheel', onWheel)
      gl.domElement.removeEventListener('contextmenu', onContextMenu)
    }
  }, [camera, gl.domElement])
  
  return {
    position: state.current.position,
    target: state.current.target
  }
}
