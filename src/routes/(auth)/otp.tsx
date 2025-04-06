import { createFileRoute, redirect } from '@tanstack/react-router'
import Otp from '@/features/auth/otp'
import { supabase } from '@/lib/supabase'

// Define the expected search params type
interface SearchParams {
  email?: string
}

// Define the loader data type
interface LoaderData {
  emailSent: boolean
}

export const Route = createFileRoute('/(auth)/otp')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      email: search.email as string | undefined,
    }
  },
  beforeLoad: async ({ search }): Promise<LoaderData> => {
    // Check if user is already authenticated
    const { data } = await supabase.auth.getSession()
    
    if (data.session) {
      throw redirect({
        to: '/',
      })
    }
    
    if (search.email) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: search.email,
        })
        
        if (error) {
          return { emailSent: false }
        }
        
        return { emailSent: true }
      } catch (error) {
        return { emailSent: false }
      }
    }
    
    return { emailSent: false }
  },
  component: Otp,
})