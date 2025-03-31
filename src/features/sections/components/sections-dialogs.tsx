import { useSectionsContext } from '../context/sections-context'
import { CreateSectionDialog } from './create-section-dialog'
import { EditSectionDialog } from './edit-section-dialog'
import { DeleteSectionDialog } from './delete-section-dialog'
import { DeleteSectionProductsDialog } from './delete-section-products-dialog'
import { SectionSceneEditor } from './section-scene-editor'

export function SectionsDialogs() {
  const { dialogOpen, closeDialog, selectedSectionId } = useSectionsContext()

  return (
    <>
      <CreateSectionDialog
        open={dialogOpen.create}
        onOpenChange={(open) => {
          if (!open) closeDialog('create')
        }}
      />

      {selectedSectionId && (
        <>
          <EditSectionDialog
            open={dialogOpen.edit}
            onOpenChange={(open) => {
              if (!open) closeDialog('edit')
            }}
            sectionId={selectedSectionId}
          />

          <DeleteSectionDialog
            open={dialogOpen.delete}
            onOpenChange={(open) => {
              if (!open) closeDialog('delete')
            }}
            sectionId={selectedSectionId}
          />

          <DeleteSectionProductsDialog
            open={dialogOpen.deleteProducts}
            onOpenChange={(open) => {
              if (!open) closeDialog('deleteProducts')
            }}
            sectionId={selectedSectionId}
          />
        </>
      )}

      <SectionSceneEditor
        open={dialogOpen.sceneEditor}
        onOpenChange={(open) => {
          if (!open) closeDialog('sceneEditor')
        }}
      />
    </>
  )
}
