import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useModelUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedModelPath, setUploadedModelPath] = useState<string | null>(null)
  
  const uploadModel = async (file: File, sectionId: string) => {
    try {
      setIsUploading(true)
      setUploadProgress(0)
      
      // Always use 'model.glb' as the filename
      const filePath = `store/sections/${sectionId}/model.glb`
      
      
      // Upload the file without the onUploadProgress option
      const { error } = await supabase.storage
        .from('models')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite if exists
          
        })
      
      if (error) throw error
      
      // Set progress to 100% when upload completes
      setUploadProgress(100)
      
      // Get the public URL
      const { data } = supabase.storage
        .from('models')
        .getPublicUrl(filePath)
      
      const modelPath = data.publicUrl
      setUploadedModelPath(modelPath)
      
      return modelPath
    } catch (error) {
      console.error('Error uploading model:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }
  
  return {
    uploadModel,
    isUploading,
    uploadProgress,
    uploadedModelPath
  }
}
