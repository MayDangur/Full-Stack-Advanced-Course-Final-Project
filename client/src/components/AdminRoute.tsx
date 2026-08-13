import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface AdminRouteProps {
  children: ReactNode;
}

function AdminRoute({
  children,
}: AdminRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until the authentication state is ready
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Regular users cannot access admin pages
  if (user.role !== "admin") {
    return (
      <Navigate
        to="/personal-area"
        replace
      />
    );
  }

  // Allow admin users to access the page
  return <>{children}</>;
}

export default AdminRoute;