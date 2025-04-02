import { lazy, Suspense, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CameraControlsHelp } from '@/features/scene-viewer/components/camera-controls-help'
import {  useSectionsWithModels } from '../hooks/use-sections'
import { useSectionPositions } from '../hooks/use-section-positions'
import { useModelUpload } from '../hooks/use-model-upload'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

const LazySceneViewer = lazy(() => import('@/features/scene-viewer/components/scene-viewer'))

// Define the section type to match what's expected by the SceneViewer
interface SectionModel {
  path: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

interface Section {
  id: string
  name: string
  description: string
  model: SectionModel
}

interface SectionSceneEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newSection?: {
    id: string
    name: string
    description?: string
    modelFile: File | null
  }
  onSectionCreated?: (sectionId: string) => void
}

export function SectionSceneEditor({
  open,
  onOpenChange,
  newSection,
  onSectionCreated
}: SectionSceneEditorProps) {
  // Use the new query that fetches sections with models
  const { data: sectionsWithModels, refetch } = useSectionsWithModels()
  const { sectionPositions, updateSectionPosition, updateSectionRotation, initializePositions, savePositions } = useSectionPositions()
  const { uploadModel, isUploading, uploadProgress } = useModelUpload()
  const { toast } = useToast()
  
  // State for new section model
  const [newSectionModel, setNewSectionModel] = useState<{
    modelPath: string
    position: [number, number, number]
  } | null>(null)
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false)
  
  // Initialize positions when sections are loaded
  useEffect(() => {
    if (sectionsWithModels && sectionsWithModels.length > 0) {
      initializePositions(sectionsWithModels as Section[])
    }
  }, [sectionsWithModels]) // Remove initializePositions from the dependency array
  
  // Handle new section model preview
  useEffect(() => {
    if (newSection?.modelFile && open) {
      // Create a temporary URL for the model file
      const objectUrl = URL.createObjectURL(newSection.modelFile)
      
      // Set the new section model with a default position
      setNewSectionModel({
        modelPath: objectUrl,
        position: [-150, 0, -50] // Default position
      })
      
      // Clean up the URL when the component unmounts
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    } else {
      setNewSectionModel(null)
    }
  }, [newSection, open])
  
  const handleClose = () => {
    onOpenChange(false)
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // First save all existing section positions
      await savePositions()
      
      // If there's a new section, create it and upload the model
      if (newSection && newSection.modelFile && newSectionModel && newSection.id) {
        // Use the section ID provided by the user
        const sectionId = newSection.id
        
        // Upload the model file
        await uploadModel(newSection.modelFile, sectionId)
        
        // Get the position and rotation for the new section
        const newPosition = sectionPositions['new-section']?.position || newSectionModel.position
        const newRotation = sectionPositions['new-section']?.rotation || [0, 0, 0]
        
        // Create the section in the database
        const { error: sectionError } = await supabase
          .from('sections')
          .insert({
            id: sectionId,
            name: newSection.name,
            description: newSection.description || '',
          })
        
        if (sectionError) throw sectionError
        
        // Create the model entry in the models table
        const { error: modelError } = await supabase
          .from('models')
          .insert({
            section_id: sectionId,
            position: newPosition,
            rotation: newRotation,
            scale: 1
          })
        
        if (modelError) throw modelError
        
        // Notify parent component
        if (onSectionCreated) {
          onSectionCreated(sectionId)
        }
      }
      
      // Refresh the sections data
      refetch()
      
      toast({
        title: "Cambios guardados",
        description: "Los cambios se han guardado correctamente."
      })
      
      // Close the dialog
      handleClose()
    } catch (error) {
      console.error('Error saving changes:', error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar los cambios.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex h-[90vh] max-h-[90vh] w-[70vw] max-w-[70vw] flex-col p-6'>
        <DialogHeader className='mb-2'>
          <DialogTitle>Editor de escena</DialogTitle>
          <DialogDescription>
            {newSection 
              ? 'Coloca el modelo de la nueva sección en la escena.'
              : 'Edita la posición de las secciones en la tienda virtual.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className='relative flex-1 overflow-hidden rounded-md border'>
          {/* Camera controls help */}
          <CameraControlsHelp />
          
          {/* Upload progress indicator */}
          {isUploading && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/70 p-3 rounded-md w-64">
              <p className="text-white text-sm mb-1">Subiendo modelo...</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          }>
            <LazySceneViewer
              sections={sectionsWithModels as Section[]}
              onSectionPositionChange={updateSectionPosition}
              onSectionRotationChange={updateSectionRotation}
              newSectionModel={newSectionModel || undefined}
              editable={true}
              initialCameraPosition={[-182.50, 17.16, -59.72]}
              initialCameraLookAt={[-148.19, 0, -59.23]}
            />
          </Suspense>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSaving || isUploading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isUploading}
            className="ml-2"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
