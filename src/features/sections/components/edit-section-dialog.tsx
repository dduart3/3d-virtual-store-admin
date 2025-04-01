import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSection, useUpdateSection, useUploadSectionModel } from "../hooks/use-sections"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

interface EditSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string
}

export function EditSectionDialog({
  open,
  onOpenChange,
  sectionId,
}: EditSectionDialogProps) {
  // Fetch section data
  const { data: section, isLoading } = useSection(sectionId)
 
  // Form state
  const [name, setName] = useState("")
 
  // File state
  const [modelFile, setModelFile] = useState<File | undefined>(undefined)
 
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
 
  // Mutations
  const updateSection = useUpdateSection()
  const uploadModel = useUploadSectionModel()
  const { toast } = useToast()
 
  // Initialize form with section data
  useEffect(() => {
    if (section) {
      setName(section.name)
    }
  }, [section])
 
  // Handle model file selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFile(file)
    }
  }
 
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
   
    try {
      // Validate required fields
      if (!name) {
        throw new Error("Por favor ingresa un nombre para la sección")
      }
     
      // Update the section
      await updateSection.mutateAsync({
        id: sectionId,
        section: {
          name,
        },
      })
     
      // Upload new model if provided
      if (modelFile) {
        await uploadModel.mutateAsync({
          sectionId,
          file: modelFile
        })
      }
     
      toast({
        title: "Sección actualizada",
        description: "La sección ha sido actualizada correctamente",
      })
     
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error actualizando la sección:", error)
      setError(error instanceof Error ? error.message : "Error actualizando la sección. Por favor intenta de nuevo.")
    } finally {
        setIsSubmitting(false)
    }
  }
 
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center items-center h-40">
            <Loader size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar sección</DialogTitle>
          <DialogDescription>
            Actualiza la información de la sección.
          </DialogDescription>
        </DialogHeader>
       
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
         
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
           
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modelo 3D
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModelChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {modelFile ? `Nuevo modelo: ${modelFile.name}` : "Deja vacío para mantener el modelo actual"}
                </p>
              </div>
            </div>
          </div>
         
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
