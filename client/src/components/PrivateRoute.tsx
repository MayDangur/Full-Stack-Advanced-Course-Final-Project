import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext finishes checking
  // whether the saved token is still valid
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

  // Allow authenticated users to access
  // the protected page
  return <>{children}</>;
}

export default PrivateRoute;