import { createContext, useContext, useState, ReactNode } from 'react'

type DialogType = 'create' | 'edit' | 'delete' | 'deleteProducts' | 'sceneEditor'

interface SectionsContextType {
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  openDialog: (type: DialogType) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isDeleteProductsDialogOpen: boolean
  setIsDeleteProductsDialogOpen: (open: boolean) => void
  isSceneEditorOpen: boolean
  setIsSceneEditorOpen: (open: boolean) => void
}

const SectionsContext = createContext<SectionsContextType | undefined>(undefined)

export function useSectionsContext() {
  const context = useContext(SectionsContext)
  if (context === undefined) {
    throw new Error('useSectionsContext must be used within a SectionsProvider')
  }
  return context
}

export default function SectionsProvider({ children }: { children: ReactNode }) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteProductsDialogOpen, setIsDeleteProductsDialogOpen] = useState(false)
  const [isSceneEditorOpen, setIsSceneEditorOpen] = useState(false)

  // Function to open a specific dialog
  const openDialog = (type: DialogType) => {
    // Close all dialogs first
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setIsDeleteProductsDialogOpen(false)
    setIsSceneEditorOpen(false)
    
    // Open the requested dialog
    switch (type) {
      case 'create':
        setIsCreateDialogOpen(true)
        break
      case 'edit':
        setIsEditDialogOpen(true)
        break
      case 'delete':
        setIsDeleteDialogOpen(true)
        break
      case 'deleteProducts':
        setIsDeleteProductsDialogOpen(true)
        break
      case 'sceneEditor':
        setIsSceneEditorOpen(true)
        break
    }
  }

  return (
    <SectionsContext.Provider
      value={{
        selectedSectionId,
        setSelectedSectionId,
        openDialog,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isDeleteProductsDialogOpen,
        setIsDeleteProductsDialogOpen,
        isSceneEditorOpen,
        setIsSceneEditorOpen,
      }}
    >
      {children}
    </SectionsContext.Provider>
  )
}
