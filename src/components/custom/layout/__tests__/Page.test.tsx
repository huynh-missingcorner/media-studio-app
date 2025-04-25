import { describe, it, expect } from "vitest";
import { render, screen } from "../../../../test/utils";
import { Page } from "../Page";

describe("Page", () => {
  it("renders children correctly", () => {
    render(
      <Page title="Test Page">
        <div data-testid="test-child">Test Content</div>
      </Page>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders the page title", () => {
    render(
      <Page title="Test Page Title">
        <div>Content</div>
      </Page>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Page Title"
    );
  });

  it("renders page description when provided", () => {
    render(
      <Page title="Test Page" description="This is a test page description">
        <div>Content</div>
      </Page>
    );

    expect(
      screen.getByText("This is a test page description")
    ).toBeInTheDocument();
  });

  it("accepts and applies additional className", () => {
    render(
      <Page title="Test Page" className="test-custom-class">
        <div>Content</div>
      </Page>
    );

    const pageContainer = screen.getByTestId("page-container");
    expect(pageContainer).toHaveClass("test-custom-class");
  });
});
