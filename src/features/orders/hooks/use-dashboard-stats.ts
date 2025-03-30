import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRevenueComparison() {
  return useQuery({
    queryKey: ['revenue-comparison'],
    queryFn: async () => {
      // Get current month's revenue
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      // Start of current month
      const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString()
      // Start of previous month
      const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString()
      // End of previous month
      const prevMonthEnd = new Date(currentYear, currentMonth, 0).toISOString()
      
      // Get current month revenue
      const { data: currentMonthData, error: currentError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', currentMonthStart)
      
      if (currentError) throw currentError
      
      // Get previous month revenue
      const { data: prevMonthData, error: prevError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', prevMonthStart)
        .lt('created_at', prevMonthEnd)
      
      if (prevError) throw prevError
      
      const currentMonthRevenue = currentMonthData.reduce((sum, order) => sum + order.total, 0)
      const prevMonthRevenue = prevMonthData.reduce((sum, order) => sum + order.total, 0)
      
      // Calculate percentage change
      let percentageChange = 0
      if (prevMonthRevenue > 0) {
        percentageChange = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
      } else if (currentMonthRevenue > 0) {
        percentageChange = 100 // If previous month was 0, and current month has revenue, that's a 100% increase
      }
      
      return {
        currentMonthRevenue,
        prevMonthRevenue,
        percentageChange
      }
    }
  })
}

export function useUserGrowth() {
  return useQuery({
    queryKey: ['user-growth'],
    queryFn: async () => {
      // Get current month's new users
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      // Start of current month
      const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString()
      // Start of previous month
      const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString()
      // End of previous month
      const prevMonthEnd = new Date(currentYear, currentMonth, 0).toISOString()
      
      // Get total users count
      const { count: totalUsersCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      if (totalError) throw totalError
      
      // Get new users this month count
      const { count: newUsersCount, error: newError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonthStart)
      
      if (newError) throw newError
      
      // Get new users last month count
      const { count: lastMonthUsersCount, error: lastError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', prevMonthStart)
        .lt('created_at', prevMonthEnd)
      
      if (lastError) throw lastError
      
      // Use safe values with nullish coalescing
      const safeLastMonthCount = lastMonthUsersCount ?? 0
      const safeNewUsersCount = newUsersCount ?? 0
      
      // Calculate percentage change
      let percentageChange = 0
      if (safeLastMonthCount > 0) {
        percentageChange = ((safeNewUsersCount - safeLastMonthCount) / safeLastMonthCount) * 100
      } else if (safeNewUsersCount > 0) {
        percentageChange = 100 // If previous month was 0, and current month has new users, that's a 100% increase
      }
      
      return {
        totalUsers: totalUsersCount ?? 0,
        newUsers: safeNewUsersCount,
        percentageChange
      }
    }
  })
}

// Utility function for formatting
export const formatCurrency = (value: number) => {
  return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}
