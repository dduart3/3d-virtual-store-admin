import { z } from 'zod'

// Define the status as a specific union type
const OrderStatus = z.enum(['pending', 'processing', 'completed', 'cancelled'])

export const orderSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  status: OrderStatus,
  total: z.number(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      order_id: z.string(),
      product_id: z.string(),
      quantity: z.number(),
      price_at_purchase: z.number(),
      product: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        image_url: z.string().optional(),
        // Add other product fields as needed
      }).optional(),
    })
  ).optional(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    // Add other user fields as needed
  }).optional(),
})

export type Order = z.infer<typeof orderSchema>
export type OrderStatus = z.infer<typeof OrderStatus>
