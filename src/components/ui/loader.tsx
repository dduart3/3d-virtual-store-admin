import { cn } from "@/lib/utils"

type LoaderSize = "sm" | "md" | "lg"

interface LoaderProps {
  size?: LoaderSize
  className?: string
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
}

export function Loader({ size = "md", className }: LoaderProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  )
}
