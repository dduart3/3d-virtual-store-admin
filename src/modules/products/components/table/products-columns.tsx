import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar } from '@/components/ui/avatar'
import { PopulatedProduct } from '../../types/products'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'



const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export const columns: ColumnDef<PopulatedProduct>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
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
        id: 'thumbnail',
        header: 'Imagen',
        cell: ({ row }) => {

            return (
                <Avatar className="h-12 w-12">
                    <img
                        src={`${PUBLIC_URL}/thumbnails/${row.original.thumbnail}`}
                        alt={row.original.name}
                        className="object-cover"
                        loading='lazy'
                    />
                </Avatar>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Nombre' />,
    },
    {
        accessorKey: 'section',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Seccion' />,
        cell: ({ row }) => row.original.section.name,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Precio' />,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'))
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(price)
        },
    },
    {
        accessorKey: 'stock',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Stock' />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Estado' />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const colorMap = {
                'In Stock': 'bg-green-100 text-green-800 border-green-200',
                'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
            }
            return (
                <Badge variant='outline' className={colorMap[status as keyof typeof colorMap] || ''}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]