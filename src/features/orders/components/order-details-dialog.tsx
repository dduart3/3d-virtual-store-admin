import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Order } from '../data/schema'
import { cn } from '@/lib/utils'
import { getProductThumbnailUrl } from '@/features/products/hooks/useProducts'

interface OrderDetailsDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

const OrderStatusBadge = ({ 
  status, 
  className 
}: { 
  status: Order['status']
  className?: string
}) => {
  // Using only the variants that are available in your Badge component
  const statusConfig = {
    pending: { 
      label: 'Pendiente', 
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/40'
    },
    processing: { 
      label: 'Procesando', 
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500 dark:hover:bg-blue-900/40'
    },
    completed: { 
      label: 'Completado', 
      variant: 'secondary' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500 dark:hover:bg-green-900/40'
    },
    cancelled: { 
      label: 'Cancelado', 
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500 dark:hover:bg-red-900/40'
    },
  }

  const { label, variant, className: statusClassName } = statusConfig[status]

  return (
    <Badge 
      variant={variant} 
      className={cn(statusClassName, className)}
    >
      {label}
    </Badge>
  )
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            Detalles de la Orden #{order.id.substring(0, 8)}
          </DialogTitle>
          <DialogDescription>
            Creada el{' '}
            {format(new Date(order.created_at), 'PPP', { locale: es })} a las{' '}
            {format(new Date(order.created_at), 'p', { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='text-sm font-medium'>Estado</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div>
              <h3 className='text-sm font-medium'>Total</h3>
              <div className='mt-1 font-semibold'>
                {formatCurrency(order.total)}
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium'>Cliente</h3>
            {order.user ? (
              <div className='mt-1'>
                <div>
                  {order.user.first_name} {order.user.last_name}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {order.user.email}
                </div>
              </div>
            ) : (
              <div className='mt-1 text-muted-foreground'>
                Usuario no disponible
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className='mb-2 text-sm font-medium'>Productos</h3>
            {order.items && order.items.length > 0 ? (
              <ScrollArea className='h-[200px] rounded-md border p-2'>
                <div className='space-y-4'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-start justify-between'
                    >
                      <div className='flex items-start space-x-3'>
                        {item.product?.id && (
                          <img
                            src={getProductThumbnailUrl(item.product.id)}
                            alt={item.product.name}
                            className='h-12 w-12 rounded-md object-cover'
                          />
                        )}
                        <div>
                          <div className='font-medium'>
                            {item.product?.name || 'Producto desconocido'}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Cantidad: {item.quantity} ×{' '}
                            {formatCurrency(item.price_at_purchase)}
                          </div>
                        </div>
                      </div>
                      <div className='font-medium'>
                        {formatCurrency(item.quantity * item.price_at_purchase)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className='text-muted-foreground'>
                No hay productos disponibles
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
