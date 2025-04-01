import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Loader } from '@/components/ui/loader'
import { columns } from './components/sections-columns'
import { SectionsDialogs } from './components/sections-dialogs'
import { SectionsTable } from './components/sections-table'
import  SectionsProvider  from './context/sections-context'
import { useSections } from './hooks/use-sections'
import { SectionsPrimaryButtons } from './components/sections-primary-buttons'

export default function Sections() {
  const { data: sections, isLoading, error } = useSections()

  return (
    <SectionsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Secciones de la Tienda</h2>
            <p className='text-muted-foreground'>
              Administra las secciones y su posicionamiento en la tienda virtual.
            </p>
          </div>
          <SectionsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              Error al cargar las secciones. Por favor, intenta de nuevo.
            </div>
          ) : (
            <SectionsTable data={sections || []} columns={columns} />
          )}
        </div>
      </Main>

      <SectionsDialogs />
    </SectionsProvider>
  )
}
