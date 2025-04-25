import { describe, it, expect } from "vitest";
import { render, screen } from "../../../../test/utils";
import { Container } from "../Container";

describe("Container", () => {
  it("renders children correctly", () => {
    render(
      <Container>
        <div data-testid="test-child">Test Content</div>
      </Container>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with default className", () => {
    render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveClass("container mx-auto px-4 md:px-6");
  });

  it("accepts and applies additional className", () => {
    render(
      <Container className="test-custom-class">
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveClass("test-custom-class");
    expect(container).toHaveClass("container mx-auto px-4 md:px-6");
  });

  it("applies max-width className when maxWidth prop is provided", () => {
    render(
      <Container maxWidth="sm">
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveClass("max-w-screen-sm");
  });
});
