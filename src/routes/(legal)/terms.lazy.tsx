import Terms from '@/features/terms'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(legal)/terms')({
  component: Terms,
})

