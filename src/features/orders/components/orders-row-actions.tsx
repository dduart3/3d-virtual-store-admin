import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Order } from '../data/schema'
import { useUpdateOrderStatus } from '../hooks/use-orders'
import { useOrdersContext } from '../context/orders-context'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order = row.original as Order
  const { setSelectedOrder, setIsDetailsOpen } = useOrdersContext()
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

  const handleStatusChange = (newStatus: Order['status']) => {
    updateStatus({ 
      id: order.id, 
      status: newStatus 
    })
  }

  const handleViewDetails = () => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewDetails}>
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={order.status === 'pending' || isPending}
          onClick={() => handleStatusChange('pending')}
        >
          Marcar como pendiente
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={order.status === 'processing' || isPending}
          onClick={() => handleStatusChange('processing')}
        >
          Marcar como procesando
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={order.status === 'completed' || isPending}
          onClick={() => handleStatusChange('completed')}
        >
          Marcar como completado
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={order.status === 'cancelled' || isPending}
          onClick={() => handleStatusChange('cancelled')}
        >
          Marcar como cancelado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
