import { Order } from '../../orders/hooks/use-orders'

export function exportOrdersToCSV(orders: Order[]) {
  // Define CSV headers
  const headers = [
    'ID',
    'Nombre',
    'Email',
    'Estado',
    'Total',
    'Fecha',
    'Dirección'
  ].join(',')
  
  // Format each order as a CSV row
  const rows = orders.map(order => {
    const fullName = `${order.user?.first_name || ''} ${order.user?.last_name || ''}`.trim()
    const address = order.shipping_address ? 
      `"${JSON.stringify(order.shipping_address).replace(/"/g, '""')}"` : 
      ''
    
    return [
      order.id,
      fullName,
      order.user?.email || '',
      order.status,
      order.total,
      new Date(order.created_at).toLocaleDateString(),
      address
    ].join(',')
  })
  
  // Combine headers and rows
  const csv = [headers, ...rows].join('\n')
  
  // Create a download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `ordenes-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportSalesByCategoryToCSV(categorySales: { name: string, value: number }[]) {
  // Define CSV headers
  const headers = ['Categoría', 'Ventas Totales'].join(',')
  
  // Format each category as a CSV row
  const rows = categorySales.map(category => {
    return [
      category.name,
      category.value
    ].join(',')
  })
  
  // Combine headers and rows
  const csv = [headers, ...rows].join('\n')
  
  // Create a download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `ventas-por-categoria-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
