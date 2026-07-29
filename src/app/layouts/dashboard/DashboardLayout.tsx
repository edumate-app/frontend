import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigation } from './components/top-navigation';
import { useState } from 'react';
import { Sidebar } from './components/side-bar';
import { MobileSidebar } from './components/mobile-side-bar';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isVideoLesson = /^\/app\/videos\/(?!new$)[^/]+$/.test(pathname);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <div className="hidden h-full shrink-0 md:flex">
        <Sidebar />
      </div>
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavigation onMenuClick={() => setMobileOpen(true)} />
        <main
          className={cn(
            'min-h-0 flex-1 scrollbar-thin',
            isVideoLesson ? 'overflow-visible' : 'overflow-y-auto',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
