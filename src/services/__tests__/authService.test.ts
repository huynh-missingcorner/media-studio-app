import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authService } from "@/services/authService";
import { RegisterDto, LoginDto } from "@/types/auth";

// Mock axios
vi.mock("axios");

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const userData: RegisterDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
      };

      const mockResponse = {
        data: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          expiresIn: 900,
          userId: "user123",
          role: "USER",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/auth/register", userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("accessToken")).toBe("mock-access-token");
      expect(localStorage.getItem("refreshToken")).toBe("mock-refresh-token");
    });

    it("should throw an error when registration fails", async () => {
      // Arrange
      const userData: RegisterDto = {
        email: "test@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
      };

      const mockError = new Error("User already exists");
      // Set properties directly on the Error object to simulate what axios produces
      mockError.name = "AxiosError";
      (mockError as AxiosError).response = {
        status: 409,
        statusText: "Conflict",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {
          message: "User already exists",
        },
      };

      vi.mocked(axios.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow(
        "User already exists"
      );
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Arrange
      const loginData: LoginDto = {
        email: "test@example.com",
        password: "Password123",
      };

      const mockResponse = {
        data: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          expiresIn: 900,
          userId: "user123",
          role: "USER",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.login(loginData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/auth/login", loginData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("accessToken")).toBe("mock-access-token");
      expect(localStorage.getItem("refreshToken")).toBe("mock-refresh-token");
    });

    it("should throw an error when login fails", async () => {
      // Arrange
      const loginData: LoginDto = {
        email: "test@example.com",
        password: "Password123",
      };

      const mockError = new Error("Invalid credentials");
      // Set properties directly on the Error object to simulate what axios produces
      mockError.name = "AxiosError";
      (mockError as AxiosError).response = {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {
          message: "Invalid credentials",
        },
      };

      vi.mocked(axios.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      // Arrange
      const refreshToken = "old-refresh-token";

      const mockResponse = {
        data: {
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
          expiresIn: 900,
          userId: "user123",
          role: "USER",
        },
      };

      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.refreshToken(refreshToken);

      // Assert
      expect(axios.post).toHaveBeenCalledWith("/api/auth/refresh", {
        refreshToken,
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("accessToken")).toBe("new-access-token");
      expect(localStorage.getItem("refreshToken")).toBe("new-refresh-token");
    });
  });

  describe("logout", () => {
    it("should clear localStorage on logout", () => {
      // Arrange
      localStorage.setItem("accessToken", "mock-access-token");
      localStorage.setItem("refreshToken", "mock-refresh-token");

      // Act
      authService.logout();

      // Assert
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });
  });

  describe("getUserProfile", () => {
    it("should get user profile successfully", async () => {
      // Arrange
      const mockResponse = {
        data: {
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.getUserProfile();

      // Assert
      expect(axios.get).toHaveBeenCalledWith("/api/users/profile");
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile successfully", async () => {
      // Arrange
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
      };

      const mockResponse = {
        data: {
          email: "test@example.com",
          firstName: "Updated",
          lastName: "Name",
        },
      };

      vi.mocked(axios.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.updateUserProfile(updateData);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        "/api/users/profile",
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
