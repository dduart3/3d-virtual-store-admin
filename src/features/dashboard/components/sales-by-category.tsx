import { useCategorySales } from '../../orders/hooks/use-orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function SalesByCategory() {
  const { data: categorySales, isLoading, error } = useCategorySales()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Categoría</CardTitle>
        <CardDescription>
          Categorías ordenadas por volumen de ventas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            Error al cargar los datos: {error.message}
          </div>
        ) : categorySales && categorySales.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Ventas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorySales.map((category) => (
                <TableRow key={category.name}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">${category.value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay datos de ventas por categoría disponibles.
            <br />
            <span className="text-sm">
              Los datos aparecerán cuando haya ventas completadas.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
