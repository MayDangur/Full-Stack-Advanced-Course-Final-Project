import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import api from "../services/api";

// Basic data stored for the logged-in user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Values and actions available through the auth context
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  // Keep the current user available across the app
  const [user, setUser] = useState<User | null>(
    null
  );

  // Restore the saved token when the app starts
  const [token, setToken] = useState<
    string | null
  >(localStorage.getItem("token"));

  // Used while checking the current authentication state
  const [loading, setLoading] =
    useState(true);

  // Restore the user session when a token is available
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Ask the server for the user connected to this token
        const response = await api.get(
          "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        // Clear the session if the saved token is no longer valid
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [token]);

  // Save a successful login in both storage and context
  const login = (
    user: User,
    token: string
  ) => {
    localStorage.setItem("token", token);

    setUser(user);
    setToken(token);
  };

  // Clear all authentication data on logout
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  // Share the authentication state with the rest of the app
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  // Prevent using the hook outside of AuthProvider
  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}