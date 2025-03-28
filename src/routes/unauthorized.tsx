import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  const { signOut } = useAuth()
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Acceso Denegado</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        No tienes permisos para acceder a este recurso.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Volver
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
