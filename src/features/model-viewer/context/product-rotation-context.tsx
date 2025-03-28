import { createContext, useState, ReactNode } from "react";

interface ProductRotationContextType {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
}

export const ProductRotationContext = createContext<ProductRotationContextType>({
  isDragging: false,
  setIsDragging: () => {},
  rotationSpeed: 0.01,
  setRotationSpeed: () => {},
});

export function ProductRotationProvider({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  return (
    <ProductRotationContext.Provider
      value={{
        isDragging,
        setIsDragging,
        rotationSpeed,
        setRotationSpeed,
      }}
    >
      {children}
    </ProductRotationContext.Provider>
  );
}
