import React, { createContext, useState } from 'react'
import { PopulatedProduct } from '../types/products'

type ProductsDialogType = 'create' | 'edit' | 'delete' | null

interface ProductsContextType {
    open: ProductsDialogType | null
    setOpen: (type: ProductsDialogType | null) => void
    currentProduct: PopulatedProduct | null
    setCurrentProduct: React.Dispatch<React.SetStateAction<PopulatedProduct | null>>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

interface Props {
    children: React.ReactNode
}

export function ProductsProvider({ children }: Props) {
    const [open, setOpen] = useState<ProductsDialogType>(null)
    const [currentProduct, setCurrentProduct] = useState<PopulatedProduct | null>(null)

    return (
        <ProductsContext.Provider value={{ open, setOpen, currentProduct, setCurrentProduct }}>
            {children}
        </ProductsContext.Provider>
    )
}

export function useProductsContext() {
    const context = React.useContext(ProductsContext)
    if (!context) {
        throw new Error('useProductsContext must be used within ProductsProvider')
    }
    return context
}