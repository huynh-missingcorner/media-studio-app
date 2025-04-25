import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../authStore";
import { authService } from "@/services/authService";

// Mock the auth service
vi.mock("@/services/authService", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Reset the store state before each test
    act(() => {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should update state on successful login", async () => {
    const mockUser = {
      id: "user1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    };
    const mockResponse = {
      user: mockUser,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    vi.mocked(authService.login).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe("access-token");
    expect(result.current.refreshToken).toBe("refresh-token");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  it("should handle login errors", async () => {
    const errorMessage = "Invalid credentials";
    vi.mocked(authService.login).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("test@example.com", "wrong-password");
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should update state on successful registration", async () => {
    const mockUser = {
      id: "user1",
      email: "new@example.com",
      firstName: "New",
      lastName: "User",
      role: "USER",
    };
    const mockResponse = {
      user: mockUser,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    vi.mocked(authService.register).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.signup({
        firstName: "New",
        lastName: "User",
        email: "new@example.com",
        password: "password123",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe("access-token");
    expect(result.current.refreshToken).toBe("refresh-token");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should clear state on logout", async () => {
    // First login to set the state
    const mockUser = {
      id: "user1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    };
    act(() => {
      useAuthStore.setState({
        user: mockUser,
        accessToken: "access-token",
        refreshToken: "refresh-token",
        isLoading: false,
        error: null,
      });
    });

    const { result } = renderHook(() => useAuthStore());

    // Verify the state is set
    expect(result.current.user).toEqual(mockUser);

    // Logout
    await act(async () => {
      result.current.logout();
    });

    // Verify state is cleared
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(authService.logout).toHaveBeenCalled();
  });

  it("should refresh access token successfully", async () => {
    // Set initial state with refresh token
    act(() => {
      useAuthStore.setState({
        user: null,
        accessToken: "old-token",
        refreshToken: "refresh-token",
        isLoading: false,
        error: null,
      });
    });

    vi.mocked(authService.refreshToken).mockResolvedValueOnce({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresIn: 3600,
      userId: "user1",
      role: "USER",
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.refreshAccessToken();
    });

    expect(result.current.accessToken).toBe("new-access-token");
    expect(result.current.refreshToken).toBe("new-refresh-token");
    expect(authService.refreshToken).toHaveBeenCalledWith("refresh-token");
  });

  it("should handle password reset request", async () => {
    vi.mocked(authService.resetPassword).mockResolvedValueOnce();

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.resetPassword("test@example.com");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.resetPassword).toHaveBeenCalledWith("test@example.com");
  });
});
