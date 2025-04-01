import { useSectionsContext } from '../context/sections-context'
import { CreateSectionDialog } from './create-section-dialog'
import { EditSectionDialog } from './edit-section-dialog'
import { DeleteSectionDialog } from './delete-section-dialog'
import { DeleteSectionProductsDialog } from './delete-section-products-dialog'
import { SectionSceneEditor } from './section-scene-editor'

export function SectionsDialogs() {
  const {
    selectedSectionId,
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
  } = useSectionsContext()

  return (
    <>
      <CreateSectionDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      {selectedSectionId && (
        <>
          <EditSectionDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen} 
            sectionId={selectedSectionId} 
          />
          
          <DeleteSectionDialog 
            open={isDeleteDialogOpen} 
            onOpenChange={setIsDeleteDialogOpen} 
            sectionId={selectedSectionId} 
          />
          
          <DeleteSectionProductsDialog 
            open={isDeleteProductsDialogOpen} 
            onOpenChange={setIsDeleteProductsDialogOpen} 
            sectionId={selectedSectionId} 
          />
        </>
      )}
      
      <SectionSceneEditor 
        open={isSceneEditorOpen} 
        onOpenChange={setIsSceneEditorOpen} 
      />
    </>
  )
}
