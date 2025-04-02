import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Define the section type based on your codebase
interface SectionModel {
  path: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

interface Section {
  id: string
  name: string
  description: string
  model: SectionModel
}

export function useSectionPositions() {
  const [sectionPositions, setSectionPositions] = useState<Record<string, {
    position: [number, number, number],
    rotation: [number, number, number]
  }>>({})
  
  // Use a ref to track if positions have been initialized
  const initialized = useRef(false)
  
  // Update a section's position
  const updateSectionPosition = useCallback((id: string, position: [number, number, number]) => {
    setSectionPositions(prev => ({
      ...prev,
      [id]: {
        ...prev[id] || { rotation: [0, 0, 0] },
        position
      }
    }))
  }, [])
  
  // Update a section's rotation
  const updateSectionRotation = useCallback((id: string, rotation: [number, number, number]) => {
    setSectionPositions(prev => ({
      ...prev,
      [id]: {
        ...prev[id] || { position: [0, 0, 0] },
        rotation
      }
    }))
  }, [])
  
  // Initialize positions from sections
  const initializePositions = useCallback((sections: Section[]) => {
    // Only initialize if not already initialized or if sections have changed
    if (!initialized.current) {
      const positions: Record<string, {
        position: [number, number, number],
        rotation: [number, number, number]
      }> = {}
      
      sections.forEach(section => {
        if (section.model) {
          positions[section.id] = {
            position: section.model.position,
            rotation: section.model.rotation
          }
        }
      })
      
      setSectionPositions(positions)
      initialized.current = true
    }
  }, [])
  
  // Reset initialization state when component unmounts
  useEffect(() => {
    return () => {
      initialized.current = false
    }
  }, [])
  
  // Save positions to database
  const savePositions = useCallback(async () => {
    try {
      // Update each section's model in the database
      const updates = Object.entries(sectionPositions).map(async ([id, { position, rotation }]) => {
        if (id === 'new-section') return Promise.resolve() // Skip the new section
        
        // Update the model entry for this section
        const { error } = await supabase
          .from('models')
          .update({
            position,
            rotation
          })
          .eq('section_id', id)
          .is('product_id', null)
        
        if (error) throw error
      })
      
      await Promise.all(updates)
      return true
    } catch (error) {
      console.error('Error saving section positions:', error)
      return false
    }
  }, [sectionPositions])
  
  return {
    sectionPositions,
    updateSectionPosition,
    updateSectionRotation,
    initializePositions,
    savePositions
  }
}
