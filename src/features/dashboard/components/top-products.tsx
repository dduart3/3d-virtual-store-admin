import { useTopProducts } from '../../orders/hooks/use-orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export function TopProducts() {
  const { data: topProducts, isLoading, error } = useTopProducts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
        <CardDescription>
          Los productos con mayor número de unidades vendidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            Error al cargar los datos: {error.message}
          </div>
        ) : topProducts && topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.sales} unidades · ${product.revenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{product.percentage}%</div>
                </div>
                <Progress value={product.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay datos de productos vendidos disponibles.
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
