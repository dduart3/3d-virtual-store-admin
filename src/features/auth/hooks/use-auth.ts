import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '../types/auth-types'

export function useAuth() {
  const queryClient = useQueryClient()

  // Get current user session
  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    },
  })

  // Get user profile with role
  const profileQuery = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      if (!sessionQuery.data?.user?.id) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          role:roles(*)
        `)
        .eq('id', sessionQuery.data.user.id)
        .single()
      
      if (error) throw error
      return data as UserProfile
    },
    enabled: !!sessionQuery.data?.user?.id,
  })

  // Sign in mutation
  const signIn = useMutation({
    mutationFn: async ({ 
      email, 
      password 
    }: { 
      email: string
      password: string 
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      // Check if user has admin role
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`*`)
          .eq('id', data.user.id)
          .single()
        
        if (profileError) throw profileError
        
        // Check if user has admin role
        if (profileData?.role_id !== 1) {
          await supabase.auth.signOut()
          throw new Error('Acceso denegado. Se necesita privilegios de administrador.')
        }
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // Sign out mutation
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // Check if user has a specific role
  const hasRole = (roleName: string) => {
    return profileQuery.data?.role?.name === roleName
  }

  const resetPassword = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      return data
    }
  })

  return {
    user: sessionQuery.data?.user || null,
    profile: profileQuery.data || null,
    isAdmin: hasRole('admin'),
    hasRole,
    isLoading: sessionQuery.isLoading || profileQuery.isLoading,
    signIn,
    signOut,
    resetPassword,
  }
}
