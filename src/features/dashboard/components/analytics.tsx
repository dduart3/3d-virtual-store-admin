import { CategorySales } from './category-sales'
import { SalesByCategory } from './sales-by-category'
import { TopProducts } from './top-products'

export function Analytics() {
  return (
    <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
        <CategorySales />
        <SalesByCategory />
        <TopProducts />
      </div>
    </div>
  )
}
