import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

export const router = createBrowserRouter([
  {
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            children: [
              {
                path: "/dashboard",
                element: <h1>Dashboard Page</h1>,
              },
            ],
          },
        ],
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
