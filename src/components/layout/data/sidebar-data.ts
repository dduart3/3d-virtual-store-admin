import {
  IconChecklist,
  //IconLayoutGrid,
  IconPackages,
  IconUsers,
  IconGraph
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
          title: 'Panel',
          url: '/',
          icon: IconGraph,
        },
        {
          title: 'Productos',
          url: '/products',
          icon: IconPackages,
        },
        {
          title: 'Órdenes',
          url: '/orders',
          icon: IconChecklist,
        },

        //{
         // title: 'Secciones',
          //url: '/sections',
         // icon: IconLayoutGrid,
       // },
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
