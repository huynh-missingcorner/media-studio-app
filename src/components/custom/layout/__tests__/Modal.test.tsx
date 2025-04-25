import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../../test/utils";
import { Modal } from "../Modal";

describe("Modal", () => {
  it("renders children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    );

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render children when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    );

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal Title">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText("Close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the overlay", () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking modal content", () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div data-testid="modal-inner-content">Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-inner-content"));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
