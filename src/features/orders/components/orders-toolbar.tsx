import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/table/data-table-faceted-filter'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'

interface OrdersToolbarProps<TData> {
  table: Table<TData>
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

export function OrdersToolbar<TData>({
  table,
  dateRange,
  setDateRange,
}: OrdersToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || dateRange !== undefined

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar órdenes..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Estado"
            options={[
              {
                label: 'Pendiente',
                value: 'pending',
              },
              {
                label: 'Procesando',
                value: 'processing',
              },
              {
                label: 'Completado',
                value: 'completed',
              },
              {
                label: 'Cancelado',
                value: 'cancelled',
              },
            ]}
          />
        )}
        <DatePickerWithRange
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              setDateRange(undefined)
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
