import { describe, it, expect } from "vitest";
import { render, screen } from "../../../../test/utils";
import { Layout } from "../Layout";

describe("Layout", () => {
  it("renders children correctly", () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with default className", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const layoutContainer = screen.getByTestId("layout-container");
    expect(layoutContainer).toHaveClass("min-h-screen bg-background");
  });

  it("accepts and applies additional className", () => {
    render(
      <Layout className="test-custom-class">
        <div>Content</div>
      </Layout>
    );

    const layoutContainer = screen.getByTestId("layout-container");
    expect(layoutContainer).toHaveClass("test-custom-class");
    expect(layoutContainer).toHaveClass("min-h-screen bg-background");
  });
});
