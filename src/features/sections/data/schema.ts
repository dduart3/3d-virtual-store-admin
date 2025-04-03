import { z } from 'zod'

// Section schema
export const sectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  created_at: z.string().optional(),
})


// Section model schema
export const sectionModelSchema = z.object({
  id: z.number().optional(),
  section_id: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
  scale: z.number(), // Scale is just a number
  label: z.string().optional(),
  created_at: z.string().optional(),
})

// Create section schema
export const createSectionSchema = sectionSchema.omit({ created_at: true })

// Update section schema
export const updateSectionSchema = sectionSchema.partial().required({ id: true })

// Create section model schema
export const createSectionModelSchema = sectionModelSchema.omit({ id: true, created_at: true })

// Update section model schema
export const updateSectionModelSchema = sectionModelSchema.partial().required({ id: true })

// Types derived from schemas
export type Section = z.infer<typeof sectionSchema>
export type SectionModel = z.infer<typeof sectionModelSchema>
export type CreateSectionInput = z.infer<typeof createSectionSchema>
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>
export type CreateSectionModelInput = z.infer<typeof createSectionModelSchema>
export type UpdateSectionModelInput = z.infer<typeof updateSectionModelSchema>
