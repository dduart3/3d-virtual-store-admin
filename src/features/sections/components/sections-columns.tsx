import { ColumnDef } from '@tanstack/react-table'
import { Section } from '../data/schema'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useSectionsContext } from '../context/sections-context'
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { formatDate } from "@/lib/utils"

export const columns: ColumnDef<Section>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string
      return date ? formatDate(date) : '-'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const section = row.original
      const { openDialog, setSelectedSectionId } = useSectionsContext()
      const handleEdit = () => {
        setSelectedSectionId(section.id)
        openDialog('edit')
      }
      const handleDelete = () => {
        setSelectedSectionId(section.id)
        openDialog('delete')
      }
      const handleDeleteProducts = () => {
        setSelectedSectionId(section.id)
        openDialog('deleteProducts')
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDeleteProducts}
            >
              Eliminar productos
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              Eliminar sección
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
