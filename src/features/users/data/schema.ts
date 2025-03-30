import { z } from 'zod'

// Define roles enum
export const UserRoles = {
  ADMIN: 1,
  USER: 2,
} as const

// Convert roles to array for select inputs
export const userRoleOptions = [
  { label: 'Administrador', value: UserRoles.ADMIN },
  { label: 'Usuario', value: UserRoles.USER },
]

// Helper function to get role label
export const getRoleLabel = (roleId: number) => {
  const role = userRoleOptions.find((role) => role.value === roleId)
  return role?.label || 'Desconocido'
}

// Base schema for validation
export const userSchema = z.object({
  id: z.string().uuid().optional(),

  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'El nombre de usuario solo puede contener letras, números, guiones, puntos y guiones bajos'
    ),

  email: z
    .string()
    .email('Correo electrónico inválido')
    .refine((email) => email.includes('.'), {
      message:
        'El correo electrónico debe contener un dominio válido (con punto)',
    }),

  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/,
      'El nombre solo puede contener letras y espacios'
    ),

  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/,
      'El apellido solo puede contener letras y espacios'
    ),

  phone: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Número de teléfono inválido. Debe contener entre 10 y 15 dígitos, opcionalmente con un signo + al inicio'
    )
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),

  avatar_url: z
    .string()
    .or(z.literal(''))
    .refine(
      (url) => {
        // Check if URL matches the ReadyPlayerMe format
        const regex = /^https:\/\/models\.readyplayer\.me\/[0-9a-f]{24}\.glb$/
        return regex.test(url)
      },
      {
        message:
          'La URL debe tener el formato: https://models.readyplayer.me/[id].glb',
      }
    ),
  role_id: z
    .number()
    .int()
    .min(1, 'Debe seleccionar un rol')
    .refine((role) => Object.values(UserRoles).includes(role as 1 | 2), {
      message: 'El rol seleccionado no es válido',
    }),

  created_at: z.string().optional(),
})

// Schema for creating a new user
export const createUserSchema = userSchema.omit({ id: true })

// Schema for updating an existing user
export const updateUserSchema = userSchema.partial().required({ id: true })

// Types derived from schemas
export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
