import apiClient from "@/lib/api";
import {
  AuthResponseDto,
  LoginDto,
  ProfileDto,
  RefreshTokenDto,
  RegisterDto,
  UpdateProfileDto,
} from "@/types/auth.types";

/**
 * Service for handling authentication and user profile operations
 */
export const authService = {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Authentication response with tokens
   */
  async register(userData: RegisterDto): Promise<AuthResponseDto> {
    const response = await apiClient.post<AuthResponseDto>(
      "/auth/register",
      userData
    );

    // Store tokens in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  },

  /**
   * Login an existing user
   * @param loginData - User login credentials
   * @returns Authentication response with tokens
   */
  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const response = await apiClient.post<AuthResponseDto>(
      "/auth/login",
      loginData
    );

    // Store tokens in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  },

  /**
   * Refresh the access token using a refresh token
   * @param refreshToken - The refresh token
   * @returns Authentication response with new tokens
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const data: RefreshTokenDto = { refreshToken };
    const response = await apiClient.post<AuthResponseDto>(
      "/auth/refresh",
      data
    );

    // Store new tokens in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  },

  /**
   * Log out the current user by removing tokens
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Request a password reset for a user
   * @param email - The user's email address
   */
  async resetPassword(email: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { email });
  },

  /**
   * Get the current user's profile
   * @returns User profile data
   */
  async getUserProfile(): Promise<ProfileDto> {
    const response = await apiClient.get<ProfileDto>("/users/profile");
    return response.data;
  },

  /**
   * Update the current user's profile
   * @param data - Profile data to update
   * @returns Updated user profile
   */
  async updateUserProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    const response = await apiClient.patch<ProfileDto>("/users/profile", data);
    return response.data;
  },
};
