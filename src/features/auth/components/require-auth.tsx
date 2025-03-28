import { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'

interface RequireAuthProps {
  children: ReactNode
  requiredRole?: string
}

export function RequireAuth({ children, requiredRole = 'admin' }: RequireAuthProps) {
  const { user, hasRole, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/sign-in" />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}
