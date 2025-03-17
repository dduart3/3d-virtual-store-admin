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
  const handleClick = (href: string) => {
    window.location.href = href;
    onNavigate?.(href);
  };

  return (
    <nav className="flex items-center space-x-4">
      {links.map((link) => (
        <button
          key={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.isActive ? "text-black dark:text-white" : "text-muted-foreground"
          )}
          disabled={link.disabled}
          onClick={() => handleClick(link.href)}
        >
          {link.title}
        </button>
      ))}
    </nav>
  );
}