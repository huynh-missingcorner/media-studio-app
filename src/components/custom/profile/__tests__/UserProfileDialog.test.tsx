import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@/test/utils";
import { UserProfileDialog } from "../UserProfileDialog";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/api/authService";

// Mock the useAuth hook
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock the authService
vi.mock("@/services/authService", () => ({
  authService: {
    updateUserProfile: vi.fn(),
  },
}));

describe("UserProfileDialog", () => {
  const mockUser = {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "user",
  };

  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the useAuth hook to return a user
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
  });

  it("renders the dialog with user profile data when open", () => {
    render(<UserProfileDialog open={true} onOpenChange={mockOnOpenChange} />);

    // Check if the dialog content is rendered
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Update your profile information below.")
    ).toBeInTheDocument();

    // Check if user data is pre-filled
    expect(screen.getByLabelText("First Name")).toHaveValue(mockUser.firstName);
    expect(screen.getByLabelText("Last Name")).toHaveValue(mockUser.lastName);
    expect(screen.getByLabelText("Email")).toHaveValue(mockUser.email);
  });

  it("does not render the dialog when closed", () => {
    render(<UserProfileDialog open={false} onOpenChange={mockOnOpenChange} />);

    // Dialog should not be in the document
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    const mockUpdateProfile = vi.fn().mockResolvedValue(mockUser);
    (
      authService.updateUserProfile as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(mockUpdateProfile);

    render(<UserProfileDialog open={true} onOpenChange={mockOnOpenChange} />);

    // Modify the form
    const firstNameInput = screen.getByLabelText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    // Submit the form
    const submitButton = screen.getByText("Save changes");
    fireEvent.click(submitButton);

    // Verify that updateUserProfile was called with the correct data
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Jane",
          lastName: mockUser.lastName,
          email: mockUser.email,
        })
      );
    });

    // Verify that onOpenChange was called to close the dialog
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows validation errors for invalid input", async () => {
    render(<UserProfileDialog open={true} onOpenChange={mockOnOpenChange} />);

    // Clear the first name field
    const firstNameInput = screen.getByLabelText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "" } });

    // Submit the form
    const submitButton = screen.getByText("Save changes");
    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });

    // Verify that the service was not called
    expect(authService.updateUserProfile).not.toHaveBeenCalled();
  });
});
