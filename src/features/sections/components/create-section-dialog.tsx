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
import { useCreateSection, useUploadSectionModel } from "../hooks/use-sections"
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
  const [name, setName] = useState("")
  const [sectionId, setSectionId] = useState("")
  
  // File state
  const [modelFile, setModelFile] = useState<File | undefined>(undefined)
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isIdValid, setIsIdValid] = useState(true)
  
  // Mutations
  const createSection = useCreateSection()
  const uploadModel = useUploadSectionModel()
  const { toast } = useToast()
  
  // Reset form
  const resetForm = () => {
    setName("")
    setSectionId("")
    setModelFile(undefined)
    setError(null)
    setIsIdValid(true)
  }
  
  // Handle model file selection
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFile(file)
    }
  }
  
  // Validate section ID format (kebab-case)
  const validateSectionId = (id: string) => {
    const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return kebabCaseRegex.test(id);
  }
  
  // Handle section ID change
  const handleSectionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSectionId(value);
    
    // Only validate if there's a value
    if (value) {
      setIsIdValid(validateSectionId(value));
    } else {
      setIsIdValid(true); // Empty is considered valid until submission
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
      
      if (!sectionId) {
        throw new Error("Por favor ingresa un ID para la sección")
      }
      
      if (!validateSectionId(sectionId)) {
        throw new Error("El ID de la sección debe estar en formato kebab-case (ejemplo: 'women-accessories')")
      }
      
      if (!modelFile) {
        throw new Error("Por favor sube un modelo 3D para la sección")
      }
      
      // Create the section
      await createSection.mutateAsync({
        id: sectionId,
        name,
        created_at: new Date().toISOString(),
      })
      
      // Upload the model file
      await uploadModel.mutateAsync({
        sectionId,
        file: modelFile
      })
      
      toast({
        title: "Sección creada",
        description: "La sección ha sido creada exitosamente",
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
              <Label htmlFor="sectionId" className="text-right">
                ID
              </Label>
              <div className="col-span-3">
                <Input
                  id="sectionId"
                  value={sectionId}
                  onChange={handleSectionIdChange}
                  className={!isIdValid ? "border-destructive" : ""}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Usa formato kebab-case (ejemplo: 'women-accessories')
                </p>
                {!isIdValid && (
                  <p className="text-sm text-destructive mt-1">
                    El ID debe estar en formato kebab-case
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modelo 3D
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  type="file"
                  accept=".glb"
                  onChange={handleModelChange}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Sube un modelo 3D en formato GLB
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !isIdValid}>
              {isSubmitting ? "Creando..." : "Crear sección"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
