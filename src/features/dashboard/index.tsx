import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { DashboardStats } from './components/dashboard-stats'
import { Analytics } from './components/analytics'
import { useOrders, useCategorySales } from '../orders/hooks/use-orders'
import { exportOrdersToCSV, exportSalesByCategoryToCSV } from './utils/export-utils'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: orders } = useOrders()
  const { data: categorySales } = useCategorySales()
  
  const handleExport = () => {
    if (activeTab === 'overview' && orders) {
      exportOrdersToCSV(orders)
    } else if (activeTab === 'analytics' && categorySales) {
      exportSalesByCategoryToCSV(categorySales)
    }
  }
  
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Panel de Administración</h1>
          <div className='flex items-center space-x-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Descargar</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExport}>
                  {activeTab === 'overview' ? 'Exportar Órdenes (CSV)' : 'Exportar Ventas por Categoría (CSV)'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
          onValueChange={setActiveTab}
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Vista General</TabsTrigger>
              <TabsTrigger value='analytics'>
                Analíticas
              </TabsTrigger>

            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <DashboardStats />
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Resumen de Ventas</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Ventas Recientes</CardTitle>
                  <CardDescription>
                    Últimas transacciones completadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Panel',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Usuarios',
    href: '/users',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Productos',
    href: '/products',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Configuración',
    href: '/settings',
    isActive: false,
    disabled: false,
  },
]
