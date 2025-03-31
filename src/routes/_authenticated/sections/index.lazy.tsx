import { createLazyFileRoute } from '@tanstack/react-router'
import Sections from '@/features/sections'

export const Route = createLazyFileRoute('/_authenticated/sections/')({
  component: Sections,
})
