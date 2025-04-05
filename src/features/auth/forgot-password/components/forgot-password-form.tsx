import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
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
import { useAuth } from '@/features/auth/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { Link } from '@tanstack/react-router'

type ForgotFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor ingresa tu correo electrónico' })
    .email({ message: 'Correo electrónico inválido' }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    resetPassword.mutate(data.email, {
      onSuccess: () => {
        setIsSubmitted(true)
        toast({
          title: "Correo enviado",
          description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        })
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Ocurrió un error al enviar el correo de recuperación.",
          variant: "destructive",
        })
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="font-medium">¡Correo enviado!</h3>
        <p className="text-sm text-muted-foreground">
          Hemos enviado un enlace de recuperación a tu correo electrónico.
          Por favor revisa tu bandeja de entrada.
        </p>
        <Button asChild className="w-full mt-4">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder='nombre@ejemplo.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className='mt-2' 
              disabled={resetPassword.isPending}
              type="submit"
            >
              {resetPassword.isPending ? "Enviando..." : "Continuar"}
            </Button>
            <Button 
              variant="link" 
              className="mt-2 px-0" 
              asChild
            >
              <Link to="/">Volver al inicio de sesión</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
