import { lazy, Suspense } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CameraControlsHelp } from '@/features/scene-viewer/components/camera-controls-help'
//import { useSections } from '../hooks/use-sections'


const LazySceneViewer = lazy(() => import('../../../features/scene-viewer/components/scene-viewer'));

interface SectionSceneEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SectionSceneEditor({
  open,
  onOpenChange,
}: SectionSceneEditorProps) {
  //const { data: sections, isLoading } = useSections()

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex h-[90vh] max-h-[90vh] w-[70vw] max-w-[70vw] flex-col p-6'>
        <DialogHeader className='mb-2'>
          <DialogTitle>Editor de escena</DialogTitle>
          <DialogDescription>
            Visualiza la tienda virtual en 3D.
          </DialogDescription>
        </DialogHeader>

        <div className='relative flex-1 overflow-hidden rounded-md border'>
          {/* Camera controls help */}
          <CameraControlsHelp />

      
          <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            }>
              <LazySceneViewer />
            </Suspense>
         </div>

      </DialogContent>
    </Dialog>
  )
}




