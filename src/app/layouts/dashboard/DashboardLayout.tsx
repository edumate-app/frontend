import { Outlet } from "react-router-dom";
import { TopNavigation } from "./components/top-navigation";
import { useState } from "react";
import { Sidebar } from "./components/side-bar";
import { MobileSidebar } from "./components/mobile-side-bar";

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <div className="hidden h-full shrink-0 md:flex">
        <Sidebar />
      </div>
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavigation onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
