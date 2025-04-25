import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Base API URL - should be configured from environment variables in a real app
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create a custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Determine if we're in a test environment to prevent interceptor errors
const isTest = import.meta.env.MODE === "test";

// Create and configure the Axios instance
const apiClient: AxiosInstance = isTest
  ? axios // In test environments, use the base axios which gets mocked
  : axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

// Only add interceptors in non-test environments
if (!isTest) {
  // Request interceptor for adding auth token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const data = error.response.data;
        const message =
          (data as { message?: string })?.message || error.message;

        // If token is expired (401), try to refresh token
        if (status === 401) {
          // You could implement token refresh logic here
          // For now, we'll just throw the error
        }

        throw new ApiError(message, status, data);
      } else if (error.request) {
        // The request was made but no response was received
        throw new ApiError("No response from server", 0);
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new ApiError(error.message, 0);
      }
    }
  );
}

export default apiClient;
