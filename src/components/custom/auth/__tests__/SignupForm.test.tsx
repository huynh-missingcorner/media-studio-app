import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "../SignupForm";

const mockOnSubmit = vi.fn();

describe("SignupForm", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test("renders the signup form correctly", () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);

    // Submit the form without filling the fields
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByTestId("firstName-error")).toHaveTextContent(
        "First name is required"
      );
      expect(screen.getByTestId("lastName-error")).toHaveTextContent(
        "Last name is required"
      );
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "Email is required"
      );
      expect(screen.getByTestId("password-error")).toHaveTextContent(
        "Password is required"
      );
    });

    // Verify that the onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for password that doesn't meet requirements", async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);

    // Fill in all fields but with a weak password
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "weak" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "weak" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check if validation error is displayed for password
    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toHaveTextContent(
        "Password must be at least 8 characters"
      );
    });

    // Verify that the onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error when passwords don't match", async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);

    // Fill in all fields but with mismatched passwords
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "DifferentPassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check if validation error is displayed for password confirmation
    await waitFor(() => {
      expect(screen.getByTestId("confirmPassword-error")).toHaveTextContent(
        "Passwords do not match"
      );
    });

    // Verify that the onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("submits the form with valid data", async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);

    const validData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password123",
    };

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: validData.firstName },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: validData.lastName },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: validData.email },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: validData.password },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: validData.password },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check if onSubmit is called with the right data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(validData);
    });
  });

  test("displays loading state during submission", async () => {
    // Create a slow mock that doesn't resolve immediately
    const slowMockSubmit = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

    render(<SignupForm onSubmit={slowMockSubmit} />);

    // Fill in valid data
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "john.doe@example.com"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "Password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "Password123"
    );

    // Submit the form
    await userEvent.click(screen.getByTestId("signup-button"));

    // Check if loading state is active - using waitFor to wait for state update
    expect(screen.getByTestId("signup-button")).toHaveTextContent(
      /signing up/i
    );
  });
});
