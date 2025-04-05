import Privacy from '@/features/privacy'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(legal)/privacy')({
  component: Privacy,
})


