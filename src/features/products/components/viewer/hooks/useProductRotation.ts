import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { ProductRotationContext } from "../context/product-rotation-context";

export function useProductRotation() {
  const { isDragging, setIsDragging, rotationSpeed, setRotationSpeed } = useContext(ProductRotationContext);
  const { gl } = useThree();
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = (e.clientX - previousMousePosition.current.x) * 0.005
        setRotationSpeed(delta)
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setTimeout(() => setRotationSpeed(0), 150)
    }

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl, isDragging, setIsDragging]);

  return { isDragging, rotationSpeed };
}
