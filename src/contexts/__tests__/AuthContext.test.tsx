import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { useAuthStore } from "@/stores/authStore";

// Mock the useAuthStore hook
vi.mock("@/stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Setup a test component that uses the useAuth hook
function AuthConsumer() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return (
    <div>
      {isLoading ? (
        <div data-testid="loading">Loading...</div>
      ) : isAuthenticated ? (
        <div data-testid="authenticated">
          Authenticated as {user?.firstName} {user?.lastName}
        </div>
      ) : (
        <div data-testid="unauthenticated">Not authenticated</div>
      )}
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should provide authentication state when user is logged in", () => {
    // Mock authenticated user state
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: "user1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER",
      },
      accessToken: "token",
      refreshToken: "refresh",
      isLoading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
      resetPassword: vi.fn(),
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("authenticated")).toBeInTheDocument();
    expect(screen.getByText("Authenticated as John Doe")).toBeInTheDocument();
  });

  it("should provide unauthenticated state when user is not logged in", () => {
    // Mock unauthenticated state
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
      resetPassword: vi.fn(),
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.getByText("Not authenticated")).toBeInTheDocument();
  });

  it("should show loading state while authentication is in progress", () => {
    // Mock loading state
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
      resetPassword: vi.fn(),
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should refresh token on mount if user is authenticated", () => {
    const mockRefreshToken = vi.fn();

    // Mock authenticated state
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: "user1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "USER",
      },
      accessToken: "token",
      refreshToken: "refresh",
      isLoading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: mockRefreshToken,
      resetPassword: vi.fn(),
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
  });
});
