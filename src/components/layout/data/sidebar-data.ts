import {
  IconChecklist,
  IconLayoutDashboard,
  IconMessages,
  IconPackages,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Productos',
          url: '/products',
          icon: IconPackages,
        },
        {
          title: 'Pedidos',
          url: '/',
          icon: IconChecklist,
        },
        {
          title: 'Mensajes',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Usuarios',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    // Removed the "Configuración" section entirely
  ],
}
