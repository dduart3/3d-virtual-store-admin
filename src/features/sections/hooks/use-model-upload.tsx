import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useModelUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadModel = async (file: File, sectionId: string) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 95 ? 95 : newProgress
        })
      }, 300)
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('store')
        .upload(`sections/${sectionId}/model.glb`, file, {
          upsert: true,
          cacheControl: '3600'
        })
      
      clearInterval(progressInterval)
      
      if (error) throw error
      
      // Set progress to 100% when complete
      setUploadProgress(100)
      
      return data
    } catch (error) {
      console.error('Error uploading model:', error)
      throw error
    } finally {
      // Give a small delay before hiding the progress indicator
      setTimeout(() => {
        setIsUploading(false)
      }, 500)
    }
  }

  return {
    uploadModel,
    isUploading,
    uploadProgress
  }
}
