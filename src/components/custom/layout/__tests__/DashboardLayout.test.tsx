import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test/utils";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

// Mock the useAuth hook
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock the UserProfileDialog component
vi.mock("@/components/custom/profile/UserProfileDialog", () => ({
  UserProfileDialog: vi.fn(({ open }) =>
    open ? <div data-testid="mock-profile-dialog">Profile Dialog</div> : null
  ),
}));

describe("DashboardLayout", () => {
  const mockUser = {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "user",
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the useAuth hook to return a user and logout function
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it("renders the layout with header and content", () => {
    render(
      <DashboardLayout>
        <div data-testid="content">Test Content</div>
      </DashboardLayout>
    );

    // Check header elements
    expect(screen.getByText("Media Studio")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();

    // Check content is rendered
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("displays user initials in the avatar", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    // Check if avatar with initials is rendered
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("opens dropdown menu when clicking on avatar", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByText("JD").closest("button");
    fireEvent.click(avatarButton!);

    // Check if dropdown content is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout function when clicking logout", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByText("JD").closest("button");
    fireEvent.click(avatarButton!);

    // Click on the logout button
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("opens profile dialog when clicking profile menu item", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByText("JD").closest("button");
    fireEvent.click(avatarButton!);

    // Click on the profile button
    const profileButton = screen.getByText("Profile");
    fireEvent.click(profileButton);

    // Check if profile dialog is opened
    expect(screen.getByTestId("mock-profile-dialog")).toBeInTheDocument();
  });
});
