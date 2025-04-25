import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupPage } from "../signup-page";
import { authService } from "@/services/authService";
import { BrowserRouter } from "react-router-dom";

// Mock the authService
vi.mock("@/services/authService", () => ({
  authService: {
    register: vi.fn(),
  },
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignupPage = () => {
    return render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );
  };

  test("renders signup page with form", () => {
    renderSignupPage();

    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  test("submits the form and redirects on successful signup", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      accessToken: "mock-token",
      refreshToken: "mock-refresh",
      expiresIn: 3600,
      userId: "user123",
      role: "USER",
    });

    renderSignupPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john.doe@example.com");
    await userEvent.type(passwordInput, "Password123");
    await userEvent.type(confirmPasswordInput, "Password123");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays error message on signup failure", async () => {
    const errorMessage = "Email already in use";
    vi.mocked(authService.register).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    renderSignupPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john.doe@example.com");
    await userEvent.type(passwordInput, "Password123");
    await userEvent.type(confirmPasswordInput, "Password123");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test("shows 'sign in' link that points to login page", () => {
    renderSignupPage();

    const signInLink = screen.getByText(/sign in/i);
    expect(signInLink).toHaveAttribute("href", "/login");
  });
});
