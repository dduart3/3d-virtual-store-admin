import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategorySales } from '../../orders/hooks/use-orders'
import { Skeleton } from '@/components/ui/skeleton'

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658']

export function CategorySales() {
  const { data, isLoading } = useCategorySales()
  
  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Ventas por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[100px] w-full mt-4" />
        </CardContent>
      </Card>
    )
  }
  
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0
  
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Ventas por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data?.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Resumen</h4>
          <div className="grid grid-cols-2 gap-2">
            {data?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">${category.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t mt-2">
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
