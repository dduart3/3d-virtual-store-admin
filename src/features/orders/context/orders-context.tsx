import { createContext, useContext, useState, ReactNode } from 'react'
import { Order } from '../data/schema'

interface OrdersContextType {
  selectedOrder: Order | null
  setSelectedOrder: (order: Order | null) => void
  isDetailsOpen: boolean
  setIsDetailsOpen: (open: boolean) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function useOrdersContext() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrdersContext must be used within an OrdersProvider')
  }
  return context
}

interface OrdersProviderProps {
  children: ReactNode
}

export default function OrdersProvider({ children }: OrdersProviderProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <OrdersContext.Provider
      value={{
        selectedOrder,
        setSelectedOrder,
        isDetailsOpen,
        setIsDetailsOpen,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}
