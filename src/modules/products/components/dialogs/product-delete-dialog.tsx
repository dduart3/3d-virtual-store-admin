import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PopulatedProduct } from '../../types/products'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProduct: PopulatedProduct
}

export function ProductDeleteDialog({ open, onOpenChange, currentProduct }: Props) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (value.trim() !== currentProduct.name) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', currentProduct.id)

      if (error) throw error

      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ['products-populated'] })

      toast({
        title: 'Producto eliminado',
        description: `El producto "${currentProduct.name}" ha sido eliminado correctamente.`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al eliminar el producto.',
        variant: 'destructive',
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentProduct.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Product
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Estas seguro que quieres eliminar{' '}
            <span className='font-bold'>{currentProduct.name}</span>?
            <br />
            Esta accion no puede ser revertida.
          </p>

          <Label className='my-2'>
            Nombre del producto:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Escribe el nombre del producto para completar'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Advertencia!</AlertTitle>
            <AlertDescription>
              Esta operacion no se puede deshacer.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Eliminar'
      destructive
    />
  )
}