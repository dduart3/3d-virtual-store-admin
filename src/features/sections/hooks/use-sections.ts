import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Section, SectionModel } from '../data/schema'

export const sectionKeys = {
  all: ['sections'] as const,
  lists: () => [...sectionKeys.all, 'list'] as const,
  list: (filters: string) => [...sectionKeys.lists(), { filters }] as const,
  details: () => [...sectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sectionKeys.details(), id] as const,
  models: (sectionId: string) => [...sectionKeys.detail(sectionId), 'models'] as const,
}

// Fetch all sections
export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Section[]
    }
  })
}

// Fetch a single section by ID
export function useSection(id: string) {
  return useQuery({
    queryKey: ['sections', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Section
    },
    enabled: !!id
  })
}

// Fetch section model by section ID
export function useSectionModel(sectionId: string) {
  return useQuery({
    queryKey: ['section-models', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('section_id', sectionId)
      
      if (error) throw error
      return data as SectionModel[]
    },
    enabled: !!sectionId
  })
}

// Create a new section
export function useCreateSection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (section: Section) => {
      const { data, error } = await supabase
        .from('sections')
        .insert([section])
        .select()
        .single()
      
      if (error) throw error
      return data as Section
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    }
  })
}

// Update an existing section
export function useUpdateSection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, section }: { id: string, section: Partial<Section> }) => {
      const { data, error } = await supabase
        .from('sections')
        .update(section)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Section
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      queryClient.invalidateQueries({ queryKey: ['sections', variables.id] })
    }
  })
}

// Delete a section
export function useDeleteSection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete the section
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Delete associated models
      const { error: modelsError } = await supabase
        .from('models')
        .delete()
        .eq('section_id', id)
      
      if (modelsError) throw modelsError
      
      // Delete the model file from storage
      const { error: storageError } = await supabase.storage
        .from('store')
        .remove([`sections/${id}/model.glb`])
      
      if (storageError) {
        console.error('Error deleting model file:', storageError)
      }
      
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    }
  })
}

// Create or update a section model
export function useUpsertSectionModel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (model: SectionModel) => {
      // If model has an ID, update it, otherwise insert it
      if (model.id) {
        const { data, error } = await supabase
          .from('models')
          .update(model)
          .eq('id', model.id)
          .select()
          .single()
        
        if (error) throw error
        return data as SectionModel
      } else {
        const { data, error } = await supabase
          .from('models')
          .insert([model])
          .select()
          .single()
        
        if (error) throw error
        return data as SectionModel
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['section-models', variables.section_id] })
    }
  })
}

// Delete products associated with a section
export function useDeleteSectionProducts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('section_id', sectionId)
      
      if (error) throw error
      return sectionId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}

// Upload a model file for a section
export function useUploadSectionModel() {
  return useMutation({
    mutationFn: async ({ sectionId, file }: { sectionId: string, file: File }) => {
      const { data, error } = await supabase.storage
        .from('store')
        .upload(`sections/${sectionId}/model.glb`, file, {
          upsert: true,
          cacheControl: '3600'
        })
      
      if (error) throw error
      return data
    }
  })
}

// Add this function to your existing use-sections.tsx file

export function useUpdateSectionModel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      sectionId,
      model
    }: {
      sectionId: string,
      model: {
        position: { x: number, y: number, z: number },
        rotation: { x: number, y: number, z: number },
        scale?: number
      }
    }) => {
      // Convert objects to JSON strings for Supabase JSONB columns if needed
      const supabaseData = {
        position: JSON.stringify(model.position),
        rotation: JSON.stringify(model.rotation),
        ...(model.scale ? { scale: model.scale } : {})
      };
      
      const { data, error } = await supabase
        .from("models")  // Using the models table like in your other functions
        .update(supabaseData)
        .eq("section_id", sectionId)
        .select()
        .single()
        
      if (error) {
        throw error
      }
      
      // Parse the response back to JavaScript types
      return {
        ...data,
        position: typeof data.position === 'string' ? JSON.parse(data.position) : data.position,
        rotation: typeof data.rotation === 'string' ? JSON.parse(data.rotation) : data.rotation,
        scale: typeof data.scale === 'string' ? parseFloat(data.scale) : data.scale
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate queries using your query key pattern
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(variables.sectionId) })
      queryClient.invalidateQueries({ queryKey: sectionKeys.models(variables.sectionId) })
    }
  })
}

// Fetch all section models
export function useSectionModels() {
  return useQuery({
    queryKey: sectionKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .is('product_id', null) // Only get models that are for sections (not products)
      
      if (error) throw error
      
      // Parse JSONB fields into proper JavaScript types
      const parsedData = data.map((model: any) => ({
        ...model,
        position: typeof model.position === 'string' ? JSON.parse(model.position) : model.position,
        rotation: typeof model.rotation === 'string' ? JSON.parse(model.rotation) : model.rotation,
        scale: typeof model.scale === 'string' ? parseFloat(model.scale) : model.scale
      }));
      
      return parsedData as SectionModel[]
    }
  })
}
// Add this function to your use-sections.tsx file

// Helper function to get section model URL from Supabase Storage
export const getSectionModelUrl = (sectionId: string) => {
  return supabase.storage
    .from('store')
    .getPublicUrl(`sections/${sectionId}/model.glb`).data.publicUrl;
}
