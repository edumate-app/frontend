import { useAuthStore } from "@/features/auth/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);

  if (!hasCheckedAuth) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  console.log(
    "PublicRoute: User is not authenticated, rendering public content.",
  );
  return <Outlet />;
};
