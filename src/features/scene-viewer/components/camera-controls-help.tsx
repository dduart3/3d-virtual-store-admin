import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'

export function CameraControlsHelp() {
  const [showHelp, setShowHelp] = useState(false)
  
  return (
    <div className="absolute top-4 right-4 z-10">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white/80 dark:bg-black/80"
        onClick={() => setShowHelp(!showHelp)}
      >
        <HelpCircle size={16} className="mr-1" />
        Ayuda
      </Button>
      
      {showHelp && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg w-64">
          <h4 className="font-medium mb-2">Controles de cámara</h4>
          <ul className="text-sm space-y-1">
            <li>• Rotar: Click izquierdo + arrastrar</li>
            <li>• Mover: Click derecho + arrastrar</li>
            <li>• Zoom: Rueda del ratón</li>
          </ul>
          <h4 className="font-medium mt-3 mb-2">Controles de objetos</h4>
          <ul className="text-sm space-y-1">
            <li>• Seleccionar: Click en el objeto</li>
            <li>• Mover: Tecla T + arrastrar controles</li>
            <li>• Rotar: Tecla R + arrastrar controles</li>
          </ul>
        </div>
      )}
    </div>
  )
}
