import { Link } from '@tanstack/react-router'
import { Route as otpRoute } from '@/routes/(auth)/otp'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { OtpForm } from './components/otp-form'
import { OtpRequestForm } from './components/otp-request-form'

export default function Otp() {
  // Use getRouteApi to access route data
  const { email } = otpRoute.useSearch()
  const loaderData = otpRoute.useLoaderData() as { emailSent?: boolean }
  return (
    <AuthLayout>
      <Card className='p-6'>
        {!email ? (
          // No email provided, show the request form
          <>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-md font-semibold tracking-tight'>
                Autenticación sin contraseña
              </h1>
              <p className='text-sm text-muted-foreground'>
                Ingresa tu correo electrónico y te enviaremos un código de
                acceso único.
              </p>
            </div>
            <OtpRequestForm />
          </>
        ) : (
          // Email provided, show the OTP verification form
          <>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-md font-semibold tracking-tight'>
                Verificación de código
              </h1>
              <p className='text-sm text-muted-foreground'>
                Hemos enviado un código de verificación a{' '}
                <strong>{email}</strong>.
                <br />
                Por favor ingresa el código para continuar.
              </p>
            </div>
            <OtpForm email={email} emailSent={loaderData?.emailSent} />
            <p className='mt-4 text-center text-sm text-muted-foreground'>
              ¿No recibiste el código?{' '}
              <Link
                to='/otp'
                search={{ email }}
                className='underline underline-offset-4 hover:text-primary'
              >
                Reenviar código
              </Link>
            </p>
          </>
        )}
        <div className='mt-4 text-center text-sm text-muted-foreground'>
          <Link
            to='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Inicio de sesión con contraseña
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}
