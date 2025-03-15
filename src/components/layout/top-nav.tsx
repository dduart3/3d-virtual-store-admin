import { cn } from "@/lib/utils";

interface TopNavProps {
  links: {
    title: string;
    href: string;
    isActive: boolean;
    disabled: boolean;
  }[];
  onNavigate: (href: string) => void;
}

export function TopNav({ links, onNavigate }: TopNavProps) {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => (
        <button
          key={link.href}
          onClick={() => onNavigate(link.href)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.isActive
              ? "text-primary"
              : "text-muted-foreground",
            link.disabled && "pointer-events-none opacity-50"
          )}
          disabled={link.disabled}
        >
          {link.title}
        </button>
      ))}
    </nav>
  );
}