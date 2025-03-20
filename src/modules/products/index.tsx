import { Layout } from '@/components/layout/layout'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/table/products-columns'
import { ProductsTable } from './components/table/products-table'
import { ProductsProvider } from './context/products-context'
import { ProductDialogs } from './components/dialogs/product-dialogs'



export default function Products() {
  const headerContent = (
    <>
      <Search />
      <div className='ml-auto flex items-center space-x-4'>
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </>
  )

  return (
    <ProductsProvider>
      <Layout header={headerContent}>
        <div className='h-full flex flex-col'>





          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Lista de Productos</h2>
              <p className='text-muted-foreground'>
                Maneja tus productos aqui.
              </p>
            </div>

          </div>
          <div className='flex-1 overflow-auto'>
            <ProductsTable columns={columns} />
          </div>
        </div>
        <ProductDialogs />
      </Layout>
    </ProductsProvider>
  )
}

