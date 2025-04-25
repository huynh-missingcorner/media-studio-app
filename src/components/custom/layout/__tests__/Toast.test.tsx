import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../../test/utils";
import { Toast } from "../Toast";

describe("Toast", () => {
  it("renders toast message", () => {
    render(<Toast message="Test notification" />);

    expect(screen.getByText("Test notification")).toBeInTheDocument();
  });

  it("applies correct variant class based on type", () => {
    render(<Toast message="Success message" type="success" />);

    const toast = screen.getByTestId("toast");
    expect(toast).toHaveClass("bg-green-50");
    expect(toast).toHaveClass("text-green-800");
    expect(toast).toHaveClass("border-green-200");
  });

  it("renders error toast with correct styles", () => {
    render(<Toast message="Error message" type="error" />);

    const toast = screen.getByTestId("toast");
    expect(toast).toHaveClass("bg-red-50");
    expect(toast).toHaveClass("text-red-800");
    expect(toast).toHaveClass("border-red-200");
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();

    render(<Toast message="Test message" onClose={handleClose} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides close button when onClose is not provided", () => {
    render(<Toast message="Test message" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
