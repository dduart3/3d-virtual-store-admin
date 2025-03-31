import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>403</h1>
        <span className='font-medium'>Acceso denegado</span>
        <p className='text-center text-muted-foreground'>
          No tienes permiso para ver este recurso. <br />
          Volver atrás para continuar.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Volver atrás
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
