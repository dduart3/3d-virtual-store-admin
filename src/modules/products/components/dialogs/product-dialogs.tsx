import { useProductsContext } from '../../context/products-context'
import { ProductDeleteDialog } from './product-delete-dialog'
import { ProductEditDialog } from './product-edit-dialog'

export function ProductDialogs() {
  const { open, setOpen, currentProduct } = useProductsContext()

  if (!currentProduct) return null

  return (
    <>
      {open === 'edit' && (
        <ProductEditDialog
          open={open === 'edit'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'edit' : null)}
          currentProduct={currentProduct}
        />
      )}
      {open === 'delete' && (
        <ProductDeleteDialog
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentProduct={currentProduct}
        />
      )}
    </>
  )
}