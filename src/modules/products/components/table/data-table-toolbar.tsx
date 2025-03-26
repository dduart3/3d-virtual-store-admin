import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { PopulatedProduct } from '../../types/products'
import { useSearch } from '@/contexts/SearchContext'
import { useEffect } from 'react'

interface DataTableToolbarProps {
  table: Table<PopulatedProduct>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const { searchQuery } = useSearch()

  useEffect(() => {
    if (searchQuery) {
      table.getColumn('name')?.setFilterValue(searchQuery)
    }
  }, [searchQuery, table])

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2 py-3'>
        <Input
          placeholder='Filtrar por nombre...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reiniciar
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
