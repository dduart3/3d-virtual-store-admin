import { z } from "zod"

// Define the Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  section_id: z.string(),
  created_at: z.string().optional(),
})

// Define the Model schema
export const modelSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  position: z.array(z.number()).length(3),
  rotation: z.array(z.number()).length(3),
  scale: z.number().positive(), // Changed to a single positive float
})

// Define the Section schema
export const sectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Export types
export type Product = z.infer<typeof productSchema>
export type Model = z.infer<typeof modelSchema>
export type Section = z.infer<typeof sectionSchema>

// Extended types for UI with additional properties from hooks
export type ProductWithExtras = Product & {
  status: string;
  thumbnailUrl: string;
  sectionName: string;
}
