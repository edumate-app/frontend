import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <h1>Login Page</h1>,
          },
          {
            path: "/register",
            element: <h1>Register Page</h1>,
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
        element: <h1>Home Page</h1>,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
