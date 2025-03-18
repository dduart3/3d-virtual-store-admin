import { cn } from "@/lib/utils";

interface HeaderProps {
  children: React.ReactNode;
  fixed?: boolean;  // Add the fixed prop as optional boolean
}

export function Header({ children, fixed = false }: HeaderProps) {
  return (
    <header
      className={cn(
        'z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        fixed && 'fixed top-0'
      )}
    >
      <div className='container flex h-16 items-center px-4'>{children}</div>
    </header>
  )
}
