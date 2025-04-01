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
import { useSection, useDeleteSectionProducts } from "../hooks/use-sections"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import { AlertTriangle } from "lucide-react"

interface DeleteSectionProductsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string
}

export function DeleteSectionProductsDialog({
  open,
  onOpenChange,
  sectionId,
}: DeleteSectionProductsDialogProps) {
  const { data: section, isLoading } = useSection(sectionId)
  const deleteProducts = useDeleteSectionProducts()
  const { toast } = useToast()
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    
    try {
      await deleteProducts.mutateAsync(sectionId)
      
      toast({
        title: "Productos eliminados",
        description: "Todos los productos de esta sección han sido eliminados correctamente",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error eliminando los productos:", error)
      setError("No se pudieron eliminar los productos. Por favor intenta de nuevo.")
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
            Eliminar productos de la sección
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminarán permanentemente todos los productos
            asociados a la sección <strong>{section?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-muted p-3 rounded-md text-sm">
          <p>
            <strong>Advertencia:</strong> Esta acción eliminará todos los productos asociados a esta sección,
            incluyendo sus imágenes, modelos 3D y toda la información relacionada.
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
            {isDeleting ? "Eliminando..." : "Eliminar productos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
