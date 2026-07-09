import { useState } from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";

export function TopNavigation({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj filmów, zdań, słówek…"
          className="h-8 pl-8 text-sm bg-canvas"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-2xs text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => navigate("/app/videos/new")}
        >
          <Plus className="h-4 w-4" /> Dodaj film
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Powiadomienia</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">Czas na powtórkę 🔁</span>
              <span className="text-xs text-muted-foreground">
                24 karty czekają w sesji nauki
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">Seria 12 dni! 🔥</span>
              <span className="text-xs text-muted-foreground">
                Nie przerywaj passy — wróć dziś
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">Nowy film gotowy</span>
              <span className="text-xs text-muted-foreground">
                „Deep Work" został przetłumaczony
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary text-xs font-medium">
              Zobacz wszystkie
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />
      </div>
    </header>
  );
}
