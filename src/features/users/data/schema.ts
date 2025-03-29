import { z } from "zod";

// Define roles enum
export const UserRoles = {
  ADMIN: 1,
  USER: 2,
} as const;

// Convert roles to array for select inputs
export const userRoleOptions = [
  { label: "Administrador", value: UserRoles.ADMIN },
  { label: "Usuario", value: UserRoles.USER },
];

// Helper function to get role label
export const getRoleLabel = (roleId: number) => {
  const role = userRoleOptions.find(role => role.value === roleId);
  return role?.label || "Desconocido";
};

// Base schema for validation
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").optional().or(z.literal("")),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres").optional().or(z.literal("")),
  avatar_url: z.string().url("URL de avatar inválida").optional().or(z.literal("")),
  role_id: z.number().int().min(1, "Debe seleccionar un rol"),
  created_at: z.string().optional(),
});

// Schema for creating a new user
export const createUserSchema = userSchema.omit({ id: true });

// Schema for updating an existing user
export const updateUserSchema = userSchema.partial().required({ id: true });

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
