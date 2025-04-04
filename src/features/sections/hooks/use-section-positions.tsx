import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface SectionPosition {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

export function useSectionPositions() {
  const [sectionPositions, setSectionPositions] = useState<Record<string, SectionPosition>>({})
  const [initialPositions, setInitialPositions] = useState<Record<string, SectionPosition>>({})

  // Initialize positions from loaded sections
  const initializePositions = useCallback((sections: any[]) => {
    const positions: Record<string, SectionPosition> = {}
    
    sections.forEach(section => {
      if (section.model) {
        positions[section.id] = {
          position: section.model.position,
          rotation: section.model.rotation,
          scale: section.model.scale
        }
      }
    })
    
    setSectionPositions(positions)
    setInitialPositions(positions) // Store initial positions for comparison
  }, [])

  // Update a section's position
  const updateSectionPosition = useCallback((sectionId: string, position: [number, number, number]) => {
    setSectionPositions(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId] || { rotation: [0, 0, 0], scale: 1 },
        position
      }
    }))
  }, [])

  // Update a section's rotation
  const updateSectionRotation = useCallback((sectionId: string, rotation: [number, number, number]) => {
    setSectionPositions(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId] || { position: [0, 0, 0], scale: 1 },
        rotation
      }
    }))
  }, [])

  // Save all positions to the database
  const savePositions = useCallback(async () => {
    const updates = []
    
    // Check which positions have changed
    for (const [sectionId, position] of Object.entries(sectionPositions)) {
      // Skip the temporary 'new-section' ID
      if (sectionId === 'new-section') continue
      
      // Check if this position has changed from the initial state
      const initial = initialPositions[sectionId]
      const hasChanged = !initial || 
        !arraysEqual(position.position, initial.position) || 
        !arraysEqual(position.rotation, initial.rotation) ||
        position.scale !== initial.scale
      
      if (hasChanged) {
        updates.push(
          supabase
            .from('models')
            .upsert({
              section_id: sectionId,
              position: position.position,
              rotation: position.rotation,
              scale: position.scale
            })
        )
      }
    }
    
    // Execute all updates in parallel
    if (updates.length > 0) {
      await Promise.all(updates)
    }
    
    return true
  }, [sectionPositions, initialPositions])

  // Helper function to compare arrays
  function arraysEqual(a: any[], b: any[]) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  return {
    sectionPositions,
    updateSectionPosition,
    updateSectionRotation,
    initializePositions,
    savePositions
  }
}
