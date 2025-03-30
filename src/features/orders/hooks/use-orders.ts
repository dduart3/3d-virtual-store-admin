import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Order = {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  status: string
  total: number
  shipping_address: any
  created_at: string
  updated_at: string
  // Include joined data
  user?: {
    first_name: string
    last_name: string
    email: string
    avatar_url: string
  }
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  product?: {
    name: string
    section_id: string
    section?: {
      name: string
    }
  }
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(*),
          order_items!order_id(
            *,
            product:products!product_id(
              name,
              section_id,
              section:sections!section_id(name)
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (!data) throw new Error('No data returned from the database')
      
      return data as Order[]
    }
  })
}

// Hook for fetching recent orders
export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(first_name, last_name, email, avatar_url)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      if (!data) throw new Error('No data returned from the database')
      
      return data as Order[]
    }
  })
}

// Hook for fetching order statistics
export function useOrderStats() {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
      
      if (revenueError) throw revenueError
      if (!revenueData) throw new Error('No revenue data returned')
      
      const totalRevenue = revenueData.reduce((sum, order) => sum + order.total, 0)
      
      // Get total orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'completed')
      
      if (ordersError) throw ordersError
      if (!ordersData) throw new Error('No orders data returned')
      
      const totalOrders = ordersData.length
      
      // Get total users (customers who have placed orders)
      const { data: usersData, error: usersError } = await supabase
        .from('orders')
        .select('user_id')
        .eq('status', 'completed')
      
      if (usersError) throw usersError
      if (!usersData) throw new Error('No users data returned')
      
      const uniqueUsers = new Set(usersData.map(order => order.user_id)).size
      
      // Get active users (placed order in the last 24 hours)
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      
      const { data: activeUsersData, error: activeError } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'completed')
        .gte('created_at', oneDayAgo.toISOString())
      
      if (activeError) throw activeError
      if (!activeUsersData) throw new Error('No active users data returned')
      
      const activeUsers = activeUsersData.length
      
      return {
        totalRevenue,
        totalOrders,
        uniqueUsers,
        activeUsers
      }
    }
  })
}

// Hook for fetching sales data by time period
export function useSalesData(period: 'monthly' | 'quarterly' | 'yearly') {
  return useQuery({
    queryKey: ['sales-data', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('status', 'completed')
      
      if (error) throw error
      if (!data) throw new Error('No data returned from the database')
      
      // Process data based on period
      const now = new Date()
      const currentYear = now.getFullYear()
      
      if (period === 'monthly') {
        // Get sales for each month of the current year
        const monthlySales = Array(12).fill(0)
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        
        data.forEach(order => {
          const orderDate = new Date(order.created_at)
          if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.getMonth()
            monthlySales[month] += order.total
          }
        })
        
        return monthNames.map((name, index) => ({
          name,
          total: monthlySales[index]
        }))
      }
      
      if (period === 'quarterly') {
        // Get sales for each quarter of the current year
        const quarterlySales = [0, 0, 0, 0]
        
        data.forEach(order => {
          const orderDate = new Date(order.created_at)
          if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.getMonth()
            const quarter = Math.floor(month / 3)
            quarterlySales[quarter] += order.total
          }
        })
        
        return [
          { name: 'T1', total: quarterlySales[0] },
          { name: 'T2', total: quarterlySales[1] },
          { name: 'T3', total: quarterlySales[2] },
          { name: 'T4', total: quarterlySales[3] }
        ]
      }
      
      if (period === 'yearly') {
        // Get sales for the last 5 years
        const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i)
        const yearlySales = years.map(year => ({ year, total: 0 }))
        
        data.forEach(order => {
          const orderDate = new Date(order.created_at)
          const year = orderDate.getFullYear()
          const yearIndex = years.indexOf(year)
          if (yearIndex !== -1) {
            yearlySales[yearIndex].total += order.total // Fixed: changed item.total to order.total
          }
        })
        
        return yearlySales.map(item => ({
          name: item.year.toString(),
          total: item.total
        }))
      }
      
      return []
    }
  })
}

// Hook for fetching sales by category
export function useCategorySales() {
  return useQuery({
    queryKey: ['category-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity, price_at_purchase,
          product:products!order_items_product_id_fkey(
            section_id,
            section:sections!section_id(name)
          )
        `)
      
      if (error) {
        console.error('Error fetching category sales:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No order items found for category sales');
        return []; // Return empty array if no data
      }
      
      // Group by category and calculate totals
      const categorySales: Record<string, number> = {};
      
      data.forEach(item => {
        // Handle both array and direct object formats
        const productData = Array.isArray(item.product) ? item.product[0] : item.product;
        
        if (productData) {
          // Handle section data which could be array or direct object
          const sectionData = Array.isArray(productData.section) 
            ? productData.section[0] 
            : productData.section;
          
          if (sectionData && sectionData.name) {
            const categoryName = sectionData.name;
            const itemTotal = item.quantity * item.price_at_purchase;
            
            if (!categorySales[categoryName]) {
              categorySales[categoryName] = 0;
            }
            
            categorySales[categoryName] += itemTotal;
          } else {
            console.log('Missing section data for product:', productData);
          }
        } else {
          console.log('Missing or invalid product data for order item:', item);
        }
      });
      
      // Convert to array format for chart and sort by value (highest to lowest)
      return Object.entries(categorySales)
        .map(([name, value]) => ({
          name,
          value
        }))
        .sort((a, b) => b.value - a.value); // Sort from highest to lowest
    }
  });
}

// Hook for fetching top products
export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['top-products', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          price_at_purchase,
          product:products!order_items_product_id_fkey(name)
        `)
      
      if (error) {
        console.error('Error fetching top products:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No order items found for top products');
        return []; // Return empty array if no data
      }
      
      // Group by product and calculate totals
      const productSales: Record<string, { name: string, sales: number, revenue: number }> = {};
      
      data.forEach(item => {
        // Handle both array and direct object formats
        const productData = Array.isArray(item.product) ? item.product[0] : item.product;
        
        if (productData && productData.name) {
          const productId = item.product_id;
          const productName = productData.name;
          
          if (!productSales[productId]) {
            productSales[productId] = {
              name: productName,
              sales: 0,
              revenue: 0
            };
          }
          
          productSales[productId].sales += item.quantity;
          productSales[productId].revenue += item.quantity * item.price_at_purchase;
        } else {
          console.log('Missing or invalid product data for order item:', item);
        }
      });
      
      // Convert to array, sort by sales (not revenue), and limit
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales) // Sort by number of items sold
        .slice(0, limit);
      
      // Calculate percentages based on top product
      const maxSales = topProducts.length > 0 ? topProducts[0].sales : 0;
      
      return topProducts.map(product => ({
        ...product,
        percentage: maxSales > 0 ? Math.round((product.sales / maxSales) * 100) : 0
      }));
    }
  });
}
