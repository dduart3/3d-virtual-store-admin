import { createContext, useContext, useState, ReactNode } from 'react'

type DialogType = 'create' | 'edit' | 'delete' | 'deleteProducts' | 'sceneEditor'

interface SectionsContextType {
  dialogOpen: Record<DialogType, boolean>
  openDialog: (dialog: DialogType) => void
  closeDialog: (dialog: DialogType) => void
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
}

const SectionsContext = createContext<SectionsContextType | undefined>(undefined)

export function useSectionsContext() {
  const context = useContext(SectionsContext)
  if (!context) {
    throw new Error('useSectionsContext must be used within a SectionsProvider')
  }
  return context
}

interface SectionsProviderProps {
  children: ReactNode
}

export default function SectionsProvider({ children }: SectionsProviderProps) {
  const [dialogOpen, setDialogOpen] = useState<Record<DialogType, boolean>>({
    create: false,
    edit: false,
    delete: false,
    deleteProducts: false,
    sceneEditor: false,
  })
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  const openDialog = (dialog: DialogType) => {
    setDialogOpen((prev) => ({ ...prev, [dialog]: true }))
  }

  const closeDialog = (dialog: DialogType) => {
    setDialogOpen((prev) => ({ ...prev, [dialog]: false }))
    if (dialog === 'edit' || dialog === 'delete' || dialog === 'deleteProducts') {
      setSelectedSectionId(null)
    }
  }

  return (
    <SectionsContext.Provider
      value={{
        dialogOpen,
        openDialog,
        closeDialog,
        selectedSectionId,
        setSelectedSectionId,
      }}
    >
      {children}
    </SectionsContext.Provider>
  )
}
