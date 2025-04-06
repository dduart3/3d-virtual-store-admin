import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/context/auth-context'
import { OtpInput } from './otp-input'

const formSchema = z.object({
  otp: z.string().min(6, { message: 'El código debe tener 6 dígitos' }),
})

interface OtpFormProps {
  email: string
  emailSent?: boolean
}

export function OtpForm({ email, emailSent = false }: OtpFormProps) {
  const [countdown, setCountdown] = useState(60)
  const [hasStartedCountdown, setHasStartedCountdown] = useState(emailSent)
  const { verifyOtp, requestOtp } = useAuth()
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Start countdown immediately if we're on this page
  useEffect(() => {
    // Initialize countdown when component mounts
    setHasStartedCountdown(true)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!hasStartedCountdown) return
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [hasStartedCountdown])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    verifyOtp.mutate(
      {
        email,
        token: data.otp,
      },
      {
        onSuccess: () => {
          // Navigate to dashboard on success
          navigate({ to: '/', replace: true })
          
          toast({
            title: 'Inicio de sesión exitoso',
            description: '¡Bienvenido de nuevo!',
          })
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Código inválido o expirado.',
            variant: 'destructive',
          })
        }
      }
    )
  }

  function resendOtp() {
    requestOtp.mutate(email, {
      onSuccess: () => {
        // Reset countdown and ensure it's running
        setCountdown(60)
        setHasStartedCountdown(true)
        
        toast({
          title: 'Código reenviado',
          description: 'Hemos enviado un nuevo código de verificación a tu correo electrónico.',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Ocurrió un error al reenviar el código.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  length={6}
                  disabled={verifyOtp.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={verifyOtp.isPending}>
          {verifyOtp.isPending ? 'Verificando...' : 'Verificar código'}
        </Button>
        
        {countdown > 0 ? (
          <p className='text-center text-sm text-muted-foreground'>
            Puedes solicitar un nuevo código en {countdown} segundos
          </p>
        ) : (
          <Button
            type='button'
            variant='ghost'
            className='w-full'
            onClick={resendOtp}
            disabled={requestOtp.isPending}
          >
            Reenviar código
          </Button>
        )}
      </form>
    </Form>
  )
}
