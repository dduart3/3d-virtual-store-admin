import { Button } from '@/components/ui/button'
import { PlusCircle, Box } from 'lucide-react'
import { useSectionsContext } from '../context/sections-context'

export function SectionsPrimaryButtons() {
  const { setIsCreateDialogOpen, setIsSceneEditorOpen } = useSectionsContext()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setIsSceneEditorOpen(true)}>
        <Box className="mr-2 h-4 w-4" />
        Editor de escena
      </Button>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nueva sección
      </Button>
    </div>
  )
}
