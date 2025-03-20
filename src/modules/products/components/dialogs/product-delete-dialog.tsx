import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PopulatedProduct } from '../../types/products'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProduct: PopulatedProduct
}

export function ProductDeleteDialog({ open, onOpenChange, currentProduct }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentProduct.name) return

    onOpenChange(false)
    toast({
      title: 'The following product has been deleted:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(currentProduct, null, 2)}
          </code>
        </pre>
      ),
    })
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