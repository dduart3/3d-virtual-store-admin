import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product, Model, ProductWithExtras, Section } from '../data/schema'

// Query keys for caching and invalidation
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  models: (productId: string) => [...productKeys.detail(productId), 'models'] as const,
  sections: () => ['sections'] as const,
}

// Helper functions to get asset URLs from Supabase Storage
export const getProductThumbnailUrl = (productId: string) => {
  return supabase.storage
    .from('store')
    .getPublicUrl(`products/${productId}/thumbnail.webp`).data.publicUrl;
}

export const getProductModelUrl = (productId: string) => {
  return supabase.storage
    .from('store')
    .getPublicUrl(`products/${productId}/model.glb`).data.publicUrl;
}

export const getSectionModelUrl = (sectionId: string) => {
  return supabase.storage
    .from('store')
    .getPublicUrl(`sections/${sectionId}/model.glb`).data.publicUrl;
}

// Fetch all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, sections(name)')
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Add status property and thumbnail URL to each product
      const productsWithExtras = data.map((product: any) => {
        let status: string;
        if (product.stock === 0) {
          status = 'Agotado';
        } else if (product.stock <= 10) {
          status = 'Pocas Unidades';
        } else {
          status = 'Disponible';
        }
        
        return {
          ...product,
          status,
          thumbnailUrl: getProductThumbnailUrl(product.id),
          sectionName: product.sections?.name || 'Sin sección'
        };
      });
      
      return productsWithExtras as ProductWithExtras[];
    },
  })
}

// Fetch all sections
export function useSections() {
  return useQuery({
    queryKey: productKeys.sections(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data as Section[];
    },
  })
}

// Fetch a single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, sections(name)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      // Add URLs for assets
      return {
        ...data,
        thumbnailUrl: getProductThumbnailUrl(data.id),
        modelUrl: getProductModelUrl(data.id),
        sectionName: data.sections?.name || 'Sin sección'
      } as ProductWithExtras & { modelUrl: string }
    },
    enabled: !!id
  })
}

// Fetch models for a product
export const useProductModels = (productId: string) => {
  return useQuery({
    queryKey: productKeys.models(productId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('product_id', productId);
     
      if (error) throw error;
      
      // Parse JSONB fields into proper JavaScript types
      const parsedData = data.map((model: Model) => ({
        ...model,
        position: typeof model.position === 'string' ? JSON.parse(model.position) : model.position,
        rotation: typeof model.rotation === 'string' ? JSON.parse(model.rotation) : model.rotation,
        scale: typeof model.scale === 'string' ? parseFloat(model.scale) : model.scale
      }));
      
      return parsedData as Model[];
    },
    enabled: !!productId
  });
};


// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      product,
      thumbnailFile,
      modelFile
    }: {
      product: Omit<Product, 'id'> & { id?: string };
      thumbnailFile?: File;
      modelFile?: File
    }) => {
      // If id is provided, use it, otherwise let Supabase generate one
      const productToInsert = product.id
        ? product
        : { ...product };
      
      // Insert product into database
      const { data, error } = await supabase
        .from('products')
        .insert(productToInsert)
        .select()
        .single()
      
      if (error) throw error
      
      const productId = data.id;
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`products/${productId}/thumbnail.webp`, thumbnailFile, {
            contentType: 'image/webp',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
      }
      
      // Upload model if provided
      if (modelFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`products/${productId}/model.glb`, modelFile, {
            contentType: 'model/gltf-binary',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
      }
      
      return data as Product
    },
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}

// Create a new model
export const useCreateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (model: {
      product_id: string;
      position: number[];
      rotation: number[];
      scale: number;
    }) => {
      // Convert arrays to JSON strings for Supabase JSONB columns
      const supabaseData = {
        ...model,
        position: JSON.stringify(model.position),
        rotation: JSON.stringify(model.rotation),
        // scale is a number, so no need to stringify
      };
      
      const { data, error } = await supabase
        .from('models')
        .insert(supabaseData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Parse the response back to JavaScript types
      return {
        ...data,
        position: typeof data.position === 'string' ? JSON.parse(data.position) : data.position,
        rotation: typeof data.rotation === 'string' ? JSON.parse(data.rotation) : data.rotation,
        scale: typeof data.scale === 'string' ? parseFloat(data.scale) : data.scale
      } as Model;
    },
    onSuccess: (data) => {
      // Invalidate models for this product
      if (data.product_id) {
        queryClient.invalidateQueries({ queryKey: productKeys.models(data.product_id) });
      }
    }
  });
};


// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      product,
      thumbnailFile,
      modelFile
    }: {
      product: Product;
      thumbnailFile?: File;
      modelFile?: File
    }) => {
      const { id, ...updatedProduct } = product;
      
      // Update product in database
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Upload new thumbnail if provided
      if (thumbnailFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`products/${id}/thumbnail.webp`, thumbnailFile, {
            contentType: 'image/webp',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
      }
      
      // Upload new model if provided
      if (modelFile) {
        const { error: uploadError } = await supabase.storage
          .from('store')
          .upload(`products/${id}/model.glb`, modelFile, {
            contentType: 'model/gltf-binary',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
      }
      
      return data as Product
    },
    onSuccess: (data) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // First delete associated models
      const { error: modelsError } = await supabase
        .from('models')
        .delete()
        .eq('product_id', id)
      
      if (modelsError) throw modelsError
      
      // Delete files from storage
      const { data: storageFiles } = await supabase.storage
        .from('store')
        .list(`products/${id}`);
        
      if (storageFiles && storageFiles.length > 0) {
        const filePaths = storageFiles.map((file: { name: string }) => `products/${id}/${file.name}`);
        const { error: storageError } = await supabase.storage
          .from('store')
          .remove(filePaths);
          
        if (storageError) throw storageError;
      }
      
      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    },
    onSuccess: (_, id) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}

// Add this mutation to your existing hooks file

// Update an existing model
export const useUpdateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (model: {
      id: string;
      product_id: string;
      position: number[];
      rotation: number[];
      scale: number;
    }) => {
      const { id, ...updateData } = model;

      console.log(updateData)
      
      // Convert arrays to JSON strings for Supabase JSONB columns
      const supabaseData = {
        ...updateData,
        position: JSON.stringify(updateData.position),
        rotation: JSON.stringify(updateData.rotation),
        scale: JSON.stringify(updateData.scale),
      };
      
      const { data, error } = await supabase
        .from('models')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Parse the response back to JavaScript types
      return {
        ...data,

      } as Model;
    },
    onSuccess: (data) => {
      // Invalidate models for this product
      if (data.product_id) {
        queryClient.invalidateQueries({ queryKey: productKeys.models(data.product_id) });
      }
    }
  });
};


