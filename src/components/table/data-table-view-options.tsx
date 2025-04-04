import { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  // Translation map for column IDs
  const columnTranslations: Record<string, string> = {
    'name': 'Nombre',
    'price': 'Precio',
    'stock': 'Disponibles',
    'status': 'Estado',
    'sectionName': 'Sección',
    'thumbnailUrl': 'Imagen',
    'user': "Cliente",
    'created_at': "Fecha",
    'role_id': "Rol",
    'full_name': "Nombre",
    'username': "Usuario",
    'email': "Correo",
    'phone': "Teléfono",
    'address': "Dirección",
    'city': "Ciudad",
    'state': "Estado",
    'country': "País",
    'zip_code': "Código postal",
    'updated_at': "Fecha de actualización",
    'deleted_at': "Fecha de eliminación",
    'id': "ID",
    // Add any other column IDs you might have
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Ver
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnTranslations[column.id] || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
