import { Link, useNavigate } from '@tanstack/react-router'
import { Route as otpRoute } from '@/routes/(auth)/otp'
import { Logo } from '../sign-in/components/logo'
import { OtpForm } from './components/otp-form'
import { OtpRequestForm } from './components/otp-request-form'
import { Button } from '@/components/ui/button'

export default function Otp() {
  // Use getRouteApi to access route data
  const { email } = otpRoute.useSearch()
  const loaderData = otpRoute.useLoaderData() as { emailSent?: boolean }
  const navigate = useNavigate()

  const handlePasswordLogin = () => {
    navigate({ to: '/sign-in' })
  }

  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left column - same as sign-in page */}
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center gap-2 text-lg font-medium'>
          <svg
            width='30'
            height='30'
            viewBox='0 0 60 60'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='30'
              cy='30'
              r='29.5'
              stroke='rgb(255,255,255)'
              strokeWidth='2'
              fill='none'
            />
            <circle
              cx='30'
              cy='30'
              r='20'
              stroke='rgb(255,255,255)'
              strokeWidth='2'
              fill='none'
            />
            <circle
              cx='30'
              cy='30'
              r='10'
              stroke='rgb(255,255,255)'
              strokeWidth='2'
              fill='none'
            />
          </svg>
          Uribe's Boutique
        </div>
        {/* Logo centered */}
        <div className='flex flex-1 items-center justify-center'>
          <Logo />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Esta plataforma ha revolucionado la forma en que
              gestionamos nuestra boutique, permitiéndonos ofrecer una
              experiencia única a nuestros clientes.&rdquo;
            </p>
            <footer className='text-sm'>Luis Uribe, Fundador</footer>
          </blockquote>
        </div>
      </div>

      {/* Right column - OTP forms */}
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          {!email ? (
            // No email provided, show the request form
            <>
              <div className='flex flex-col space-y-2 text-left'>
                <h1 className='text-2xl font-semibold tracking-tight'>
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
              <div className='flex flex-col space-y-2 text-left'>
                <h1 className='text-2xl font-semibold tracking-tight'>
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

          {/* Divider */}
          <div className='relative my-2'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                O
              </span>
            </div>
          </div>

          {/* Button for password login */}
          <Button
            variant="outline"
            onClick={handlePasswordLogin}
          >
            Iniciar sesión con contraseña
          </Button>

          {/* Terms and privacy */}
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Al iniciar sesión, indicas que aceptas{' '}
            <Link
              to='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link
              to='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

