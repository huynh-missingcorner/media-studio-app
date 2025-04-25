import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import { ProfileDto, RegisterDto, UpdateProfileDto } from "@/types/auth";

interface AuthState {
  user: ProfileDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profileData: UpdateProfileDto) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isLoading: false,
          });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: "An unknown error occurred", isLoading: false });
          }
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isLoading: false,
          });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: "An unknown error occurred", isLoading: false });
          }
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await authService.refreshToken(refreshToken);
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch {
          // If refresh fails, log the user out
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: "An unknown error occurred", isLoading: false });
          }
        }
      },

      updateProfile: async (profileData: UpdateProfileDto) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateUserProfile(profileData);
          set({ user: response, isLoading: false });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: "An unknown error occurred", isLoading: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
