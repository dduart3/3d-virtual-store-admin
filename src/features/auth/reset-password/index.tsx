import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export default function ResetPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Restablecer Contraseña
          </h1>
          <p className='text-sm text-muted-foreground'>
            Ingresa tu nueva contraseña para restablecer tu cuenta.
          </p>
        </div>
        <ResetPasswordForm />
      </Card>
    </AuthLayout>
  )
}
