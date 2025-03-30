import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSalesData } from '../../orders/hooks/use-orders'
import { Skeleton } from '@/components/ui/skeleton'

type TimePeriod = 'monthly' | 'quarterly' | 'yearly'

export function Overview() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly')
  const { data, isLoading } = useSalesData(timePeriod)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Ventas</h3>
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium p-4">Ventas</h3>
        <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
