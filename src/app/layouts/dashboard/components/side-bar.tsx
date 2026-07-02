import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  RotateCcw,
  Bookmark,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/videos", label: "Moje filmy", icon: Film },
  { to: "/dashboard/review", label: "Powtórki", icon: RotateCcw },
  { to: "/dashboard/saved", label: "Zapisane", icon: Bookmark },
  { to: "/dashboard/stats", label: "Statystyki", icon: BarChart3 },
  { to: "/dashboard/explain", label: "AI Wyjaśnienia", icon: Sparkles },
  { to: "/dashboard/settings", label: "Ustawienia", icon: Settings },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { logout } = useLogout();
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-4">
      <div className="flex items-center gap-2 px-2 pb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-sm font-bold">
          L
        </div>
        <span className="font-display text-[15px] font-semibold tracking-tight">
          LangFilm
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-2 border-t border-border pt-3">
        <Button
          variant="ghost"
          onClick={logout}
          className="flex w-full items-center justify-start gap-2.5 px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Wyloguj się
        </Button>
      </div>
    </aside>
  );
}
