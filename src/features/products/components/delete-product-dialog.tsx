import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProductWithExtras } from '../data/schema'
import { useDeleteProduct } from '../hooks/useProducts'
import { toast } from '@/hooks/use-toast'

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithExtras
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps) {
  const deleteProduct = useDeleteProduct()

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Producto</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4">
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="h-16 w-16 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
              }}
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Precio: ${product.price.toFixed(2)} | Stock: {product.stock}
              </p>
              <p className="text-sm text-muted-foreground">
                Sección: {product.sectionName}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
