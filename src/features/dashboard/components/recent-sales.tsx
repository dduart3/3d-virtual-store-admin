import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRecentOrders } from '../../orders/hooks/use-orders'
import { Skeleton } from '@/components/ui/skeleton'

export function RecentSales() {
  const { data: recentOrders, isLoading } = useRecentOrders(5)
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {recentOrders?.map((order) => {
        const fullName = `${order.user?.first_name || ''} ${order.user?.last_name || ''}`.trim()
        const initials = fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
        
        return (
          <div key={order.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={order.user?.avatar_url || ''} alt={fullName} />
              <AvatarFallback>{initials || 'UN'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{fullName || 'Usuario Anónimo'}</p>
                <p className="text-sm text-muted-foreground">
                  {order.user?.email || 'email@desconocido.com'}
                </p>
              </div>
              <div className="font-medium">+${order.total.toLocaleString()}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
