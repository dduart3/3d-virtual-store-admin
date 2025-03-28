import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SearchProvider } from '@/context/search-context'
import { cn } from '@/lib/utils'
import SkipToMain from '@/components/skip-to-main'
import Cookies from 'js-cookie'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // Check if user is authenticated
    const { data } = await supabase.auth.getSession()
    
    if (!data.session) {
      throw redirect({
        to: '/sign-in',
      })
    }
    
    // Check for admin role
    const { data: profileData } = await supabase
    .from('profiles')
    .select(`
      *,
      role:roles!role_id(*)
    `)
    .eq('id', data.session.user.id)
    .single()
    
    if (profileData?.role?.name !== 'admin') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
