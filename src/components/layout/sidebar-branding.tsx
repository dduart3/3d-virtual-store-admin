import { Command } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

export function SidebarBranding() {
  // Define the app details directly in the component
  const appDetails = {
    name: "Uribe's Boutique",
    logo: Command, // You can replace this with your custom logo component
    description: "Panel de Administración"
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='pointer-events-none' // Removes the clickable behavior
        >
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <appDetails.logo className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {appDetails.name}
            </span>
            <span className='truncate text-xs'>{appDetails.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
