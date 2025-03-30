import { useOrdersContext } from '../context/orders-context'
import { OrderDetailsDialog } from './order-details-dialog'

export function OrdersDialogs() {
  const { selectedOrder, isDetailsOpen, setIsDetailsOpen } = useOrdersContext()

  return (
    <>
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  )
}
