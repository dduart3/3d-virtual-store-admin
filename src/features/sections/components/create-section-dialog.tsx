import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useCreateSection } from "../hooks/use-sections"
import { useToast } from "@/hooks/use-toast"

interface CreateSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSectionDialog({
  open,
  onOpenChange,
}: CreateSectionDialogProps) {
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  })

  // File state
  const [modelFile, setModelFile] = useState<File | undefined>(undefined)
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mutations
  const createSection = useCreateSection()
  const { toast } = useToast()

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle model file selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFile(file)
    }
  }

  // Reset form state
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
    })
    setModelFile(undefined)
    setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error("Por favor ingresa un nombre para la sección")
      }
      
      if (!formData.id) {
        throw new Error("Por favor ingresa un ID para la sección")
      }
      
      if (!modelFile) {
        throw new Error("Por favor sube un modelo 3D para la sección")
      }
      
      // Create the section
      await createSection.mutateAsync({
        section: {
          id: formData.id,
          name: formData.name,
          description: formData.description,
          model: {
            path: `/models/sections/${formData.id}/model.glb`,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          }
        },
        modelFile,
      })
      
      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating section:", error)
      setError(error instanceof Error ? error.message : "Error al crear la sección. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva sección</DialogTitle>
          <DialogDescription>
            Añade una nueva sección a la tienda virtual.
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
              <Label htmlFor="id" className="text-right">
                ID
              </Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="mi-seccion-123"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
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
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Sube un modelo 3D en formato GLB o GLTF
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear sección"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
