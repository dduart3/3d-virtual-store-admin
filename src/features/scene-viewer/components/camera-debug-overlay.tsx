import { useEffect, useState } from 'react'

interface CameraDebugOverlayProps {
  position: [number, number, number]
  target: [number, number, number]
}

export function CameraDebugOverlay({ position, target }: CameraDebugOverlayProps) {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setVisible(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  if (!visible) return null
  
  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded font-mono text-xs z-50">
      <div>
        <strong>Camera Position:</strong> [{position[0]}, {position[1]}, {position[2]}]
      </div>
      <div>
        <strong>Camera Target:</strong> [{target[0]}, {target[1]}, {target[2]}]
      </div>
      <div className="text-gray-400 mt-1 text-[10px]">
        Press Ctrl+D to toggle this overlay or copy values to clipboard
      </div>
    </div>
  )
}
