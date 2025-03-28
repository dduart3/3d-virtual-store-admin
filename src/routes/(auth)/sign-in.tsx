import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: async () => {
    // Check if user is already authenticated
    const { data } = await supabase.auth.getSession()
    
    // If session exists, redirect to home page
    if (data.session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignIn,
})
