import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/products-columns'
import { ProductsDialogs } from './components/products-dialogs'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import { ProductsTable } from './components/products-table'
import ProductsProvider from './context/products-context'
import { useProducts } from './hooks/useProducts'
import { Loader } from '@/components/ui/loader'

export default function Products() {
  const { data: products, isLoading, error } = useProducts()

  return (
    <ProductsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Lista de Productos</h2>
            <p className='text-muted-foreground'>
              Administra tus productos y su información aquí.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              Error al cargar los productos. Por favor, intenta de nuevo.
            </div>
          ) : (
            <ProductsTable data={products || []} columns={columns} />
          )}
        </div>
      </Main>

      <ProductsDialogs />
    </ProductsProvider>
  )
}
