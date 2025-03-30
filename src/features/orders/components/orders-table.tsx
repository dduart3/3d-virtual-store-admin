import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
    VisibilityState,
  } from '@tanstack/react-table'
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  import { useState } from 'react'
  import { DataTablePagination } from '@/components/table/data-table-pagination'
  import { OrdersToolbar } from './orders-toolbar'
  import { Order } from '../data/schema'
  import { DateRange } from 'react-day-picker'
  
  interface OrdersTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    dateRange: DateRange | undefined
    setDateRange: (range: DateRange | undefined) => void
  }
  
  export function OrdersTable<TData, TValue>({
    columns,
    data,
    dateRange,
    setDateRange,
  }: OrdersTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
  
    // Filter orders by date range
    const filteredData = dateRange?.from 
      ? (data as Order[]).filter((order) => {
          const orderDate = new Date(order.created_at)
          
          // If we have a from date but no to date, check if order is on or after from date
          if (dateRange.from && !dateRange.to) {
            return orderDate >= dateRange.from
          }
          
          // If we have both from and to dates, check if order is between them
          if (dateRange.from && dateRange.to) {
            const toDateWithEndOfDay = new Date(dateRange.to)
            toDateWithEndOfDay.setHours(23, 59, 59, 999)
            return orderDate >= dateRange.from && orderDate <= toDateWithEndOfDay
          }
          
          return true
        }) as TData[]
      : data
  
    const table = useReactTable({
      data: filteredData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })
  
    return (
      <div className='space-y-4'>
        <OrdersToolbar 
          table={table} 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <DataTablePagination table={table} />
      </div>
    )
  }
  