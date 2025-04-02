import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Loader } from '@/components/ui/loader'
import { columns } from './components/orders-columns'
import { OrdersTable } from './components/orders-table'
import { OrdersDialogs } from './components/orders-dialogs'
import OrdersProvider from './context/orders-context'
import { useOrders } from './hooks/use-orders'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

// Define the expected type for the OrdersTable data
type OrderTableData = {
  id: string
  user_id: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  created_at: string
  updated_at?: string
  user?: {
    id: string
    username: string
    email: string
    first_name?: string
    last_name?: string
  }
  items?: {
    id: string
    order_id: string
    product_id: string
    quantity: number
    price_at_purchase: number
    product?: {
      id: string
      name: string
      price: number
      image_url?: string
    }
  }[]
}

export default function Orders() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { data: ordersData, isLoading, error } = useOrders(dateRange)

  // Transform the data to match the expected structure
  const orders = ordersData?.map(order => {
    // Ensure user has the required properties
    const user = order.user ? {
      id: order.user.id || '',
      username: order.user.username || '',
      email: order.user.email || '',
      first_name: order.user.first_name,
      last_name: order.user.last_name
    } : undefined;

    return {
      ...order,
      user
    };
  }) as OrderTableData[] | undefined;

  return (
    <OrdersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Órdenes</h2>
            <p className='text-muted-foreground'>
              Gestiona todas las órdenes de la tienda
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              Error al cargar las órdenes. Por favor, intenta de nuevo.
            </div>
          ) : (
            <OrdersTable
              data={orders || []}
              columns={columns}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}
        </div>
      </Main>

      <OrdersDialogs />
    </OrdersProvider>
  )
}
