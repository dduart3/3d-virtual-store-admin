import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { CreateUserInput, UpdateUserInput, User } from '../data/schema'

export function useUsers() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as User[]
    },
  })

  // Create a new user
  // Create a new user
  const createUser = useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: newUser,
      })

      if (error) {
        throw new Error(`Error al crear usuario: ${error.message}`)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Update an existing user
  const updateUser = useMutation({
    mutationFn: async (user: UpdateUserInput) => {
      const { data, error } = await supabase.functions.invoke('update-user', {
        body: user,
      })

      if (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado exitosamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Delete a user
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      })

      if (error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`)
      }

      return userId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    createUser,
    updateUser,
    deleteUser,
  }
}
