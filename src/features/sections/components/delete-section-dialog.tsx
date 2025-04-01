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
import { useSection, useDeleteSection } from "../hooks/use-sections"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import { AlertTriangle } from "lucide-react"

interface DeleteSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string
}

export function DeleteSectionDialog({
  open,
  onOpenChange,
  sectionId,
}: DeleteSectionDialogProps) {
  const { data: section, isLoading } = useSection(sectionId)
  const deleteSection = useDeleteSection()
  const { toast } = useToast()
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    
    try {
      await deleteSection.mutateAsync(sectionId)
      
      toast({
        title: "Sección eliminada",
        description: "La sección ha sido eliminada correctamente",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error eliminando la sección:", error)
      setError("No se pudo eliminar la sección. Por favor intenta de nuevo.")
    } finally {
      setIsDeleting(false)
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar sección
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la sección
            <strong> {section?.name}</strong> y todos sus datos asociados.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-muted p-3 rounded-md text-sm">
          <p>
            <strong>Nota:</strong> Esta acción no eliminará los productos asociados a esta sección.
            Si deseas eliminar también los productos, utiliza la opción "Eliminar productos" antes de
            eliminar la sección.
          </p>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar sección"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
