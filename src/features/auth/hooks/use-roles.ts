import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Role } from '../types/auth-types'

export function useRoles() {
  const queryClient = useQueryClient()

  // Get all roles
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('id')
      
      if (error) throw error
      return data as Role[]
    },
  })

  // Create a new role
  const createRole = useMutation({
    mutationFn: async (newRole: Omit<Role, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('roles')
        .insert(newRole)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // Update an existing role
  const updateRole = useMutation({
    mutationFn: async ({ id, ...role }: Partial<Role> & { id: number }) => {
      const { data, error } = await supabase
        .from('roles')
        .update(role)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // Delete a role
  const deleteRole = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  return {
    roles: rolesQuery.data,
    isLoading: rolesQuery.isLoading,
    createRole,
    updateRole,
    deleteRole,
  }
}
