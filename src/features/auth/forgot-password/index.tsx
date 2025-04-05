import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Forgot Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Introduce tu correo electrónico registrado y <br /> te enviaremos un link para reiniciar tu contraseña.
          </p>
        </div>
        <ForgotForm />
      </Card>
    </AuthLayout>
  )
}
