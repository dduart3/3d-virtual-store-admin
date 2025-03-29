import { createContext, useState, ReactNode, useContext } from "react";

interface ModelConfigContextType {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  setPosition: (position: [number, number, number]) => void;
  setRotation: (rotation: [number, number, number]) => void;
  setScale: (scale: number) => void;
  resetConfig: () => void;
}

const defaultPosition: [number, number, number] = [0, 0, 0];
const defaultRotation: [number, number, number] = [0, 0, 0];
const defaultScale: number = 1;

export const ModelConfigContext = createContext<ModelConfigContextType>({
  position: defaultPosition,
  rotation: defaultRotation,
  scale: defaultScale,
  setPosition: () => {},
  setRotation: () => {},
  setScale: () => {},
  resetConfig: () => {},
});

export function ModelConfigProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<[number, number, number]>(defaultPosition);
  const [rotation, setRotation] = useState<[number, number, number]>(defaultRotation);
  const [scale, setScale] = useState<number>(defaultScale);

  const resetConfig = () => {
    setPosition(defaultPosition);
    setRotation(defaultRotation);
    setScale(defaultScale);
  };

  return (
    <ModelConfigContext.Provider
      value={{
        position,
        rotation,
        scale,
        setPosition,
        setRotation,
        setScale,
        resetConfig,
      }}
    >
      {children}
    </ModelConfigContext.Provider>
  );
}

export const useModelConfig = () => useContext(ModelConfigContext);
