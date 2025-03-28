import React, { createContext, useContext, useState } from 'react'
import { ProductWithExtras } from '../data/schema'

type ProductsContextType = {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isUpdateDialogOpen: boolean
  setIsUpdateDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  selectedProduct: ProductWithExtras | null
  setSelectedProduct: (product: ProductWithExtras | null) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export default function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithExtras | null>(null)

  return (
    <ProductsContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isUpdateDialogOpen,
        setIsUpdateDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
