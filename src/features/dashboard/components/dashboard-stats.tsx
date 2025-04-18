import { StatCard } from './stat-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrderStats } from '../../orders/hooks/use-orders'
import { 
  useRevenueComparison, 
  useUserGrowth, 
  formatCurrency, 
  formatPercentage 
} from '../../orders/hooks/use-dashboard-stats'

export function DashboardStats() {
  const { data: orderStats, isLoading: isOrderStatsLoading } = useOrderStats()
  const { data: revenueComparison, isLoading: isRevenueLoading } = useRevenueComparison()
  const { data: userGrowth, isLoading: isUserGrowthLoading } = useUserGrowth()

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Ingresos Totales'
        value={isOrderStatsLoading ? <Skeleton className="h-6 w-24" /> : formatCurrency(orderStats?.totalRevenue || 0)}
        description={isRevenueLoading 
          ? <Skeleton className="h-4 w-32" /> 
          : `${formatPercentage(revenueComparison?.percentageChange || 0)} desde el mes pasado`
        }
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        }
      />

      <StatCard
        title='Usuarios'
        value={isUserGrowthLoading ? <Skeleton className="h-6 w-24" /> : `${userGrowth?.totalUsers || 0}`}
        description={isUserGrowthLoading 
          ? <Skeleton className="h-4 w-32" /> 
          : `${formatPercentage(userGrowth?.percentageChange || 0)} desde el mes pasado`
        }
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
        }
      />

      <StatCard
        title='Ventas'
        value={isOrderStatsLoading ? <Skeleton className="h-6 w-24" /> : `${orderStats?.totalOrders || 0}`}
        description={isRevenueLoading 
          ? <Skeleton className="h-4 w-32" /> 
          : `${formatPercentage(revenueComparison?.percentageChange || 0)} desde el mes pasado`
        }
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <rect width='20' height='14' x='2' y='5' rx='2' />
            <path d='M2 10h20' />
          </svg>
        }
      />

      <StatCard
        title='Activos Ahora'
        value={isOrderStatsLoading ? <Skeleton className="h-6 w-24" /> : `${orderStats?.activeUsers || 0}`}
        description="Usuarios con compras en las últimas 24h"
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
          </svg>
        }
      />
    </div>
  )
}
