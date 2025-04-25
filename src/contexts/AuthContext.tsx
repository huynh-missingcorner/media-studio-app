import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { ProfileDto, RegisterDto, UpdateProfileDto } from "@/types/auth";

interface AuthContextType {
  user: ProfileDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profileData: UpdateProfileDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshAccessToken,
    resetPassword,
    updateProfile,
  } = useAuthStore();

  // Refresh token on initial load if we have a refresh token
  useEffect(() => {
    if (refreshToken) {
      refreshAccessToken();
    }
  }, [refreshToken, refreshAccessToken]);

  // Set up an interval to refresh the token periodically
  useEffect(() => {
    if (!refreshToken) return;

    // Refresh token every 55 minutes (assuming 1 hour expiry)
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, refreshAccessToken]);

  const isAuthenticated = !!user && !!accessToken;

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
