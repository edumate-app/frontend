import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Settings, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const UserMenu = () => {
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();
  return (
    <div className="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:shadow-focus">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage
              src={user?.avatarUrl ?? undefined}
              alt={user?.name}
              className="rounded-full"
            />
            <AvatarFallback>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {user?.name}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="h-4 w-4" /> Ustawienia
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="h-4 w-4" /> Plan i płatności
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="h-4 w-4" /> Pomoc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" /> Wyloguj się
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
