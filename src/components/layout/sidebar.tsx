import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  BarChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/contexts/NavigationContext";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { activeRoute, setActiveRoute } = useNavigation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-3 py-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">3D Store Admin</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "ml-0")}
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-2 px-2 py-2">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={activeRoute === item.href}
              onClick={() => setActiveRoute(item.href)}
            />
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        {!collapsed && (
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">
              Logged in as Admin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SidebarNavItemProps {
  item: SidebarItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

function SidebarNavItem({ item, collapsed, isActive, onClick }: SidebarNavItemProps) {
  return (
    <li>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          item.disabled && "pointer-events-none opacity-50"
        )}
        disabled={item.disabled}
        onClick={onClick}
      >
        <span className="mr-2">{item.icon}</span>
        {!collapsed && <span>{item.title}</span>}
      </Button>
    </li>
  );
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  {
    title: "Products",
    icon: <ShoppingBag size={20} />,
    href: "/products",
  },
  {
    title: "Orders",
    icon: <Package size={20} />,
    href: "/orders",
  },
  {
    title: "Customers",
    icon: <Users size={20} />,
    href: "/customers",
  },
  {
    title: "Analytics",
    icon: <BarChart size={20} />,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    href: "/settings",
  },
];
