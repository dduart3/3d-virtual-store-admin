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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/context/auth-context'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor ingresa tu correo electrónico' })
    .email({ message: 'Correo electrónico inválido' }),
})

export function OtpRequestForm() {
  const { requestOtp } = useAuth()
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    requestOtp.mutate(data.email, {
      onSuccess: () => {
        // Navigate to OTP verification page with email parameter
        navigate({
          to: '/otp',
          search: { email: data.email },
          replace: true,
        })
        
        toast({
          title: 'Código enviado',
          description: 'Hemos enviado un código de verificación a tu correo electrónico.',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Ocurrió un error al enviar el código de verificación.',
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder='nombre@ejemplo.com'
                  {...field}
                  autoComplete='email'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={requestOtp.isPending}>
          {requestOtp.isPending ? 'Enviando...' : 'Enviar código de acceso'}
        </Button>
      </form>
    </Form>
  )
}