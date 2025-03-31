import { Button } from "@/components/ui/button"
import { PlusIcon, LayoutGridIcon } from "lucide-react"
import { useSectionsContext } from "../context/sections-context"

export function SectionsPrimaryButtons() {
  const { openDialog } = useSectionsContext()

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={() => openDialog('create')}
        className="flex items-center gap-2"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Nueva sección</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => openDialog('sceneEditor')}
        className="flex items-center gap-2"
      >
        <LayoutGridIcon className="h-4 w-4" />
        <span>Editor de escena</span>
      </Button>
    </div>
  )
}
