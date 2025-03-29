import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductWithExtras } from '../data/schema'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import { DataTableRowActions } from '../../../components/table/data-table-row-actions'

export const columns: ColumnDef<ProductWithExtras>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'thumbnailUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Imagen' />
    ),
    cell: ({ row }) => {
      // Use the thumbnailUrl property that we added in the useProducts hook
      return (
        <div className='flex items-center justify-center'>
          {row.original.thumbnailUrl ? (
            <img
              src={row.original.thumbnailUrl}
              alt={row.original.name}
              className='h-10 w-10 rounded-full object-cover'
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
              }}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground'>
              <p>No hay imagen disponible.</p>
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio' />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Disponibles' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('stock')}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      const colorMap = {
        Disponible: 'bg-green-100 text-green-800 border-green-200',
        'Pocas Unidades': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Agotado: 'bg-red-100 text-red-800 border-red-200',
      }

      return (
        <Badge
          variant='outline'
          className={colorMap[status as keyof typeof colorMap] || ''}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'sectionName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sección' />
    ),
    cell: ({ row }) => <div>{row.getValue('sectionName')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
