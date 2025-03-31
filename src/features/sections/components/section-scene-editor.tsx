import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useSections, useUpdateSection, Section } from '../hooks/use-sections'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader } from '@/components/ui/loader'
import * as THREE from 'three'

interface SectionSceneEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Component to render the store model
function StoreModel() {
  const { scene } = useGLTF('/models/scene.glb')
  return <primitive object={scene.clone()} dispose={null} />
}

// Component to render a section model
function SectionModel({ 
  section, 
  isSelected, 
  onClick,
  onPositionChange,
  onRotationChange,
  onScaleChange
}: { 
  section: Section
  isSelected: boolean
  onClick: () => void
  onPositionChange: (position: [number, number, number]) => void
  onRotationChange: (rotation: [number, number, number]) => void
  onScaleChange: (scale: number) => void
}) {
  const { scene } = useGLTF(section.model.path)
  const modelRef = useRef<THREE.Group>(null)
  
  // Apply position, rotation, and scale
  useEffect(() => {
    if (modelRef.current) {
      // Apply position
      modelRef.current.position.set(...section.model.position)
      
      // Apply rotation (convert from degrees to radians if needed)
      const rotation = section.model.rotation.map(
        angle => angle * (Math.PI / 180)
      ) as [number, number, number]
      
      modelRef.current.rotation.set(...rotation)
      
      // Apply scale
      modelRef.current.scale.set(
        section.model.scale,
        section.model.scale,
        section.model.scale
      )
    }
  }, [section])

  return (
    <group
      ref={modelRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <primitive 
        object={scene.clone()} 
        dispose={null}
      />
      {isSelected && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshBasicMaterial color="yellow" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

// Main scene editor component
export function SectionSceneEditor({ open, onOpenChange }: SectionSceneEditorProps) {
  const { data: sections, isLoading } = useSections()
  const updateSection = useUpdateSection()
  const { toast } = useToast()
  
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [editedSections, setEditedSections] = useState<Record<string, Section>>({})
  const [isSaving, setIsSaving] = useState(false)
  
  // Reset edited sections when dialog opens
  useEffect(() => {
    if (open && sections) {
      const sectionsMap: Record<string, Section> = {}
      sections.forEach(section => {
        sectionsMap[section.id] = { ...section }
      })
      setEditedSections(sectionsMap)
    } else {
      setSelectedSectionId(null)
    }
  }, [open, sections])
  
  const selectedSection = selectedSectionId ? editedSections[selectedSectionId] : null
  
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedSectionId) return
    
    setEditedSections(prev => {
      const section = { ...prev[selectedSectionId] }
      const position = [...section.model.position] as [number, number, number]
      position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value
      
      return {
        ...prev,
        [selectedSectionId]: {
          ...section,
          model: {
            ...section.model,
            position
          }
        }
      }
    })
  }
  
  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedSectionId) return
    
    setEditedSections(prev => {
      const section = { ...prev[selectedSectionId] }
      const rotation = [...section.model.rotation] as [number, number, number]
      rotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value
      
      return {
        ...prev,
        [selectedSectionId]: {
          ...section,
          model: {
            ...section.model,
            rotation
          }
        }
      }
    })
  }
  
  const handleScaleChange = (value: number) => {
    if (!selectedSectionId) return
    
    setEditedSections(prev => {
      const section = { ...prev[selectedSectionId] }
      
      return {
        ...prev,
        [selectedSectionId]: {
          ...section,
          model: {
            ...section.model,
            scale: value
          }
        }
      }
    })
  }
  
  const handleSave = async () => {
    if (!sections) return
    
    setIsSaving(true)
    
    try {
      // Find sections that have been modified
      const modifiedSections = sections.filter(section => {
        const edited = editedSections[section.id]
        if (!edited) return false
        
        // Check if position, rotation, or scale has changed
        return (
          JSON.stringify(section.model.position) !== JSON.stringify(edited.model.position) ||
          JSON.stringify(section.model.rotation) !== JSON.stringify(edited.model.rotation) ||
          section.model.scale !== edited.model.scale
        )
      })
      
      // Update each modified section
      for (const section of modifiedSections) {
        const edited = editedSections[section.id]
        
        await updateSection.mutateAsync({
          id: section.id,
          section: {
            model: {
              path: edited.model.path,
              position: edited.model.position,
              rotation: edited.model.rotation,
              scale: edited.model.scale
            }
          }
        })
      }
      
      toast({
        title: "Cambios guardados",
        description: `Se han actualizado ${modifiedSections.length} secciones.`,
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editor de escena</DialogTitle>
          <DialogDescription>
            Posiciona las secciones en la tienda virtual. Selecciona una sección para editarla.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* 3D Scene */}
          <div className="flex-1 bg-black/10 rounded-md overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                
                {/* Store model */}
                <StoreModel />
                
                {/* Section models */}
                {sections && Object.values(editedSections).map(section => (
                  <SectionModel 
                    key={section.id}
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    onPositionChange={(position) => {
                      setEditedSections(prev => ({
                        ...prev,
                        [section.id]: {
                          ...prev[section.id],
                          model: {
                            ...prev[section.id].model,
                            position
                          }
                        }
                      }))
                    }}
                    onRotationChange={(rotation) => {
                      setEditedSections(prev => ({
                        ...prev,
                        [section.id]: {
                          ...prev[section.id],
                          model: {
                            ...prev[section.id].model,
                            rotation
                          }
                        }
                      }))
                    }}
                    onScaleChange={(scale) => {
                      setEditedSections(prev => ({
                        ...prev,
                        [section.id]: {
                          ...prev[section.id],
                          model: {
                            ...prev[section.id].model,
                            scale
                          }
                        }
                      }))
                    }}
                  />
                ))}
                
                <OrbitControls />
                <Environment preset="city" />
              </Canvas>
            )}
          </div>
          
          {/* Controls Panel */}
          <div className="w-80 overflow-y-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Controles</h3>
            
            {selectedSection ? (
              <Tabs defaultValue="position">
                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="position">Posición</TabsTrigger>
                  <TabsTrigger value="rotation">Rotación</TabsTrigger>
                  <TabsTrigger value="scale">Escala</TabsTrigger>
                </TabsList>
                
                <TabsContent value="position" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Posición X</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.position[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.position[0]]}
                      min={-200}
                      max={200}
                      step={0.1}
                      onValueChange={(value) => handlePositionChange('x', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Posición Y</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.position[1].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.position[1]]}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => handlePositionChange('y', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Posición Z</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.position[2].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.position[2]]}
                      min={-200}
                      max={200}
                      step={0.1}
                      onValueChange={(value) => handlePositionChange('z', value[0])}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="rotation" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Rotación X (grados)</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.rotation[0].toFixed(2)}°
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.rotation[0]]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => handleRotationChange('x', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Rotación Y (grados)</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.rotation[1].toFixed(2)}°
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.rotation[1]]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => handleRotationChange('y', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Rotación Z (grados)</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.rotation[2].toFixed(2)}°
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.rotation[2]]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => handleRotationChange('z', value[0])}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="scale" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Escala</Label>
                      <span className="text-sm text-muted-foreground">
                        {selectedSection.model.scale.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[selectedSection.model.scale]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(value) => handleScaleChange(value[0])}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona una sección para editar sus propiedades
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Secciones disponibles</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {sections && sections.map(section => (
                  <div 
                    key={section.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedSectionId === section.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    {section.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

