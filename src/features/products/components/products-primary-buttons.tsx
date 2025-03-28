import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { useProducts } from '../context/products-context'

export function ProductsPrimaryButtons() {
  const { setIsCreateDialogOpen } = useProducts()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <IconPlus className='mr-2 h-4 w-4' />
        Nuevo Producto
      </Button>
    </div>
  )
}
