import { CreateProductDialog } from './create-product-dialog'
import { UpdateProductDialog } from './update-product-dialog'
import { DeleteProductDialog } from './delete-product-dialog'
import { useProducts } from '../context/products-context'

export function ProductsDialogs() {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduct,
  } = useProducts()

  return (
    <>
      <CreateProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      {selectedProduct && (
        <>
          <UpdateProductDialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            product={selectedProduct}
          />
          <DeleteProductDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            product={selectedProduct}
          />
        </>
      )}
    </>
  )
}
