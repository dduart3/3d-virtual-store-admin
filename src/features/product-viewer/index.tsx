import { Suspense, useState, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ViewerScene } from './components/ViewerScene'
import { ProductRotationProvider } from './context/product-rotation-context'

interface ProductViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  modelUrl?: string
  onSave: (config: {
    position: number[]
    rotation: number[]
    scale: number
  }) => void
  initialConfig?: {
    position?: number[]
    rotation?: number[]
    scale?: number
  }
}

// Camera reset component
function CameraReset() {
  const { camera } = useThree()

  useEffect(() => {
    // This will run when the component mounts or when resetCamera is called
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
  }, [])

  return null
}

export function ProductViewerModal({
  open,
  onOpenChange,
  modelUrl,
  onSave,
  initialConfig,
}: ProductViewerModalProps) {
  // Model configuration state
  const [position, setPosition] = useState<number[]>([0, 0, 0])
  const [rotation, setRotation] = useState<number[]>([0, 0, 0])
  const [scale, setScale] = useState<number>(1)

  // Viewer options
  const [showBackground, setShowBackground] = useState(true)
  const [useOrbitControls, setUseOrbitControls] = useState(false)
  const [useEffects, setUseEffects] = useState(true)
  const [resetCamera, setResetCamera] = useState(false)

  // Update state when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.position) {
        setPosition(initialConfig.position)
      }
      if (initialConfig.rotation) {
        setRotation(initialConfig.rotation)
      }
      if (initialConfig.scale !== undefined) {
        setScale(initialConfig.scale)
      }
    }
  }, [initialConfig])

  const handleSave = () => {
    onSave({
      position,
      rotation,
      scale,
    })
    onOpenChange(false)
  }

  const resetConfig = () => {
    setPosition([0, 0, 0])
    setRotation([0, 0, 0])
    setScale(1)
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = [...position]
    newPosition[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value
    setPosition(newPosition)
  }

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = [...rotation]
    newRotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value
    setRotation(newRotation)
  }

  const handleResetCamera = () => {
    setResetCamera(true)
    // Reset the flag after a short delay
    setTimeout(() => setResetCamera(false), 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[90vh] max-w-6xl overflow-hidden p-0'>
        <div className='relative h-full w-full flex-1'>
          <ProductRotationProvider>
            <Canvas
              shadows
              camera={{
                near: 0.1,
                far: 1000,
                fov: 30,
              }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            >
              <Suspense fallback={null}>
                <ViewerScene
                  modelUrl={modelUrl}
                  position={position}
                  rotation={rotation}
                  scale={scale}
                  showBackground={showBackground}
                  useEffects={useEffects}
                />
                {useOrbitControls && (
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                  />
                )}
                {resetCamera && <CameraReset />}
              </Suspense>
            </Canvas>
          </ProductRotationProvider>
        </div>
        <div className='w-80 overflow-y-auto border-l bg-background p-6'>
          <h2 className='mb-4 text-xl font-semibold'>
            Configuración del modelo
          </h2>

          {/* Viewer Options Section */}
          <div className='mb-6 rounded-md border p-4'>
            <h3 className='mb-3 text-lg font-medium'>
              Opciones de visualización
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='show-background'>Mostrar fondo</Label>
                <Switch
                  id='show-background'
                  checked={showBackground}
                  onCheckedChange={setShowBackground}
                />
              </div>
              <div className='flex items-center justify-between'>
                <Label htmlFor='use-orbit-controls'>Controles de cámara</Label>
                <Switch
                  id='use-orbit-controls'
                  checked={useOrbitControls}
                  onCheckedChange={setUseOrbitControls}
                />
              </div>
              <div className='flex items-center justify-between'>
                <Label htmlFor='use-effects'>Efectos visuales</Label>
                <Switch
                  id='use-effects'
                  checked={useEffects}
                  onCheckedChange={setUseEffects}
                />
              </div>
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                onClick={handleResetCamera}
              >
                Restablecer cámara
              </Button>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <h3 className='mb-2 text-lg font-medium'>Posición</h3>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='position-x'>
                      Horizontal: {position[0].toFixed(2)}
                    </Label>
                    <Input
                      id='position-x'
                      type='number'
                      value={position[0]}
                      onChange={(e) =>
                        handlePositionChange('x', parseFloat(e.target.value))
                      }
                      className='w-20'
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id='position-x-slider'
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[position[0]]}
                    onValueChange={(value) =>
                      handlePositionChange('x', value[0])
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='position-y'>
                      Vertical: {position[1].toFixed(2)}
                    </Label>
                    <Input
                      id='position-y'
                      type='number'
                      value={position[1]}
                      onChange={(e) =>
                        handlePositionChange('y', parseFloat(e.target.value))
                      }
                      className='w-20'
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id='position-y-slider'
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[position[1]]}
                    onValueChange={(value) =>
                      handlePositionChange('y', value[0])
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='position-z'>
                      Adelante / Atrás: {position[2].toFixed(2)}
                    </Label>
                    <Input
                      id='position-z'
                      type='number'
                      value={position[2]}
                      onChange={(e) =>
                        handlePositionChange('z', parseFloat(e.target.value))
                      }
                      className='w-20'
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id='position-z-slider'
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[position[2]]}
                    onValueChange={(value) =>
                      handlePositionChange('z', value[0])
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Rotación</h3>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='rotation-x'>
                      Eje X: {(rotation[0] * (180 / Math.PI)).toFixed(0)}°
                    </Label>
                    <Input
                      id='rotation-x'
                      type='number'
                      value={(rotation[0] * (180 / Math.PI)).toFixed(0)}
                      onChange={(e) =>
                        handleRotationChange(
                          'x',
                          parseFloat(e.target.value) * (Math.PI / 180)
                        )
                      }
                      className='w-20'
                      step={15}
                    />
                  </div>
                  <Slider
                    id='rotation-x-slider'
                    min={0}
                    max={Math.PI * 2}
                    step={0.1}
                    value={[rotation[0]]}
                    onValueChange={(value) =>
                      handleRotationChange('x', value[0])
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='rotation-y'>
                      Eje Y: {(rotation[1] * (180 / Math.PI)).toFixed(0)}°
                    </Label>
                    <Input
                      id='rotation-y'
                      type='number'
                      value={(rotation[1] * (180 / Math.PI)).toFixed(0)}
                      onChange={(e) =>
                        handleRotationChange(
                          'y',
                          parseFloat(e.target.value) * (Math.PI / 180)
                        )
                      }
                      className='w-20'
                      step={15}
                    />
                  </div>
                  <Slider
                    id='rotation-y-slider'
                    min={0}
                    max={Math.PI * 2}
                    step={0.1}
                    value={[rotation[1]]}
                    onValueChange={(value) =>
                      handleRotationChange('y', value[0])
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='rotation-z'>
                      Eje Z: {(rotation[2] * (180 / Math.PI)).toFixed(0)}°
                    </Label>
                    <Input
                      id='rotation-z'
                      type='number'
                      value={(rotation[2] * (180 / Math.PI)).toFixed(0)}
                      onChange={(e) =>
                        handleRotationChange(
                          'z',
                          parseFloat(e.target.value) * (Math.PI / 180)
                        )
                      }
                      className='w-20'
                      step={15}
                    />
                  </div>
                  <Slider
                    id='rotation-z-slider'
                    min={0}
                    max={Math.PI * 2}
                    step={0.1}
                    value={[rotation[2]]}
                    onValueChange={(value) =>
                      handleRotationChange('z', value[0])
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Escala</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <Label htmlFor='scale'>Escala: {scale.toFixed(2)}</Label>
                  <Input
                    id='scale'
                    type='number'
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className='w-20'
                    step={0.001}
                    min={0.001}
                    max={20}
                  />
                </div>
                <Slider
                  id='scale-slider'
                  min={0.001}
                  max={20}
                  step={0.001}
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                />
              </div>
            </div>

            <div className='flex gap-2 pt-4'>
              <Button
                variant='outline'
                onClick={resetConfig}
                className='flex-1'
              >
                Restablecer
              </Button>
              <Button onClick={handleSave} className='flex-1'>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
