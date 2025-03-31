import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Define section types
export interface Section {
  id: string
  name: string
  description: string
  created_at: string
  model: {
    path: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }
}

export interface SectionInput {
  id: string
  name: string
  description: string
  model: {
    path: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }
}

// Query keys
export const sectionKeys = {
  all: ['sections'] as const,
  lists: () => [...sectionKeys.all, 'list'] as const,
  list: (filters: string) => [...sectionKeys.lists(), { filters }] as const,
  details: () => [...sectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sectionKeys.details(), id] as const,
}

// Get all sections
export const useSections = () => {
  return useQuery({
    queryKey: sectionKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (!data) return []
      
      return data as Section[]
    }
  })
}

// Get a single section by ID
export const useSection = (id: string) => {
  return useQuery({
    queryKey: sectionKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) throw new Error('Section not found')
      
      return data as Section
    },
    enabled: !!id
  })
}

// Create a new section
export const useCreateSection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      section,
      modelFile
    }: {
      section: SectionInput;
      modelFile?: File
    }) => {
      // If id is provided, use it, otherwise let Supabase generate one
      const sectionToInsert = section.id
        ? section
        : { ...section };
     
      // Insert section into database
      const { data, error } = await supabase
        .from('sections')
        .insert(sectionToInsert)
        .select()
        .single()
     
      if (error) throw error
      if (!data) throw new Error('Failed to create section')
     
      const sectionId = data.id;
     
      // Upload model if provided
      if (modelFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`sections/${sectionId}/model.glb`, modelFile, {
            contentType: 'model/gltf-binary',
            upsert: true
          });
         
        if (uploadError) throw uploadError;
      }
     
      return data as Section
    },
    onSuccess: () => {
      // Invalidate sections list to refetch
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() })
    }
  })
}

// Update an existing section
export const useUpdateSection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      section,
      modelFile
    }: {
      id: string;
      section: Partial<SectionInput>;
      modelFile?: File
    }) => {
      // Update section in database
      const { data, error } = await supabase
        .from('sections')
        .update(section)
        .eq('id', id)
        .select()
        .single()
     
      if (error) throw error
      if (!data) throw new Error('Failed to update section')
     
      // Upload model if provided
      if (modelFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`sections/${id}/model.glb`, modelFile, {
            contentType: 'model/gltf-binary',
            upsert: true
          });
         
        if (uploadError) throw uploadError;
      }
     
      return data as Section
    },
    onSuccess: (_, variables) => {
      // Invalidate specific section and list
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() })
    }
  })
}

// Delete a section
export const useDeleteSection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete section from database
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id)
     
      if (error) throw error
     
      // Delete section model from storage
      const { error: storageError } = await supabase.storage
        .from('store')
        .remove([`sections/${id}/model.glb`])
     
      if (storageError) {
        console.error('Error deleting section model:', storageError)
        // Continue even if storage deletion fails
      }
     
      return id
    },
    onSuccess: (id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(id) })
    }
  })
}

// Delete all products in a section
export const useDeleteSectionProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sectionId: string) => {
      // First get all products in this section
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id')
        .eq('section_id', sectionId)
      
      if (fetchError) throw fetchError
      
      // Delete all products in the section
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('section_id', sectionId)
      
      if (error) throw error
      
      // Delete all product files from storage
      if (products && products.length > 0) {
        const productIds = products.map(p => p.id)
        
        // Delete thumbnails and models for each product
        for (const productId of productIds) {
          await supabase.storage
            .from('store')
            .remove([
              `products/${productId}/thumbnail.webp`,
              `products/${productId}/model.glb`
            ])
        }
      }
      
      return sectionId
    },
    onSuccess: () => {
      // Invalidate product and section queries
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() })
    }
  })
}
