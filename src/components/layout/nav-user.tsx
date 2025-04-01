import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {  IconLogout, IconSettings, IconUser } from '@tabler/icons-react'
import { useAuth } from '@/context/auth-context'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function NavUser() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { state } = useSidebar()

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Use profile data if available, otherwise fallback to user data
  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`
    : user?.email?.split('@')[0] || 'Usuario'

  const email = user?.email || ''
  const avatarUrl = profile?.avatar_url || ''
  const initials = getInitials(displayName)

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        // Redirect to sign-in page after successful sign-out
        navigate({ to: '/sign-in', replace: true })
      }
    })
  }

  const isCollapsed = state !== 'expanded'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <Avatar>
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          {/* Only show text content when not collapsed */}
          {!isCollapsed && (
            <div className='grid flex-1 text-sm leading-tight'>
              <span className='font-medium'>{displayName}</span>
              <span className='text-xs text-muted-foreground'>{email}</span>
            </div>
          )}
          
          {/* Only show the chevron when not collapsed */}
          {!isCollapsed && <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
     

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={signOut.isPending}
        >
          <IconLogout className='mr-2 size-4' />
          <span>Cerrar Sesión</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
