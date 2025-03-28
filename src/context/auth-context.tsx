import { createContext, useContext, ReactNode } from 'react'
import { useAuth as useAuthHook } from '@/features/auth/hooks/use-auth'
import { UserProfile } from '@/features/auth/types/auth-types'
import { Session, User } from '@supabase/supabase-js'
import { UseMutationResult } from '@tanstack/react-query'

// Define the auth context type
type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  isAdmin: boolean
  hasRole: (roleName: string) => boolean
  isLoading: boolean
  signIn: UseMutationResult<any, Error, { email: string; password: string }, unknown>
  signOut: UseMutationResult<void, Error, void, unknown>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook()
  
  return (
    <AuthContext.Provider value={auth as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
