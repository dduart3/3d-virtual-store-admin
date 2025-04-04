import { ColumnDef } from '@tanstack/react-table'
import { Order } from '../data/schema'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DataTableRowActions } from './orders-row-actions'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

import { es } from 'date-fns/locale'

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const OrderStatusBadge = ({ 
  status, 
  className 
}: { 
  status: Order['status']
  className?: string
}) => {
  // Using only the variants that are available in your Badge component
  const statusConfig = {
    pending: { 
      label: 'Pendiente', 
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/40'
    },
    processing: { 
      label: 'Procesando', 
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500 dark:hover:bg-blue-900/40'
    },
    completed: { 
      label: 'Completado', 
      variant: 'secondary' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500 dark:hover:bg-green-900/40'
    },
    cancelled: { 
      label: 'Cancelado', 
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500 dark:hover:bg-red-900/40'
    },
  }

  const { label, variant, className: statusClassName } = statusConfig[status]

  return (
    <Badge 
      variant={variant} 
      className={cn(statusClassName, className)}
    >
      {label}
    </Badge>
  )
}


export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      // Show only first 8 characters of the ID
      const id = row.getValue('id') as string
      return <div className="font-medium">{id.substring(0, 8)}...</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      if (!user) return <div>Usuario desconocido</div>
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.first_name} {user.last_name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      )
    },
    // Remove this line to enable sorting
    // enableSorting: false,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const total = row.getValue('total') as number
      return <div>{formatCurrency(total)}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"]
      return <OrderStatusBadge status={status} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return (
        <div className="flex flex-col">
          <span>
            {format(new Date(date), 'PPP', { locale: es })}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), 'p', { locale: es })}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
