import { Link, useNavigate } from '@tanstack/react-router'
import { Logo } from './components/logo'
import { UserAuthForm } from './components/user-auth-form'
import { Button } from '@/components/ui/button'

export default function SignIn() {
  const navigate = useNavigate()

  const handleOtpLogin = () => {
    navigate({ to: '/otp' })
  }

  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
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
        {/* This will now be centered and take up appropriate space */}
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
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Iniciar sesión
            </h1>
            <p className='text-sm text-muted-foreground'>
              Introduce tu correo electronico y contraseña en los campos para
              iniciar sesión.
            </p>
          </div>
          <UserAuthForm />
          
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
          
          {/* OTP login button */}
          <Button 
            variant="outline" 
            onClick={handleOtpLogin}
          >
            Iniciar sesión con código de un solo uso
          </Button>
          
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
