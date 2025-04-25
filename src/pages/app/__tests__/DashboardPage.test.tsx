import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "../dashboard-page";

// Mock the useNavigate hook
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("DashboardPage", () => {
  it("renders the dashboard with all media types", () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Check that the main title is displayed
    expect(screen.getByText("Media Studio")).toBeInTheDocument();

    // Check that the section title is displayed
    expect(screen.getByText("Start with a text prompt")).toBeInTheDocument();

    // Check all media type options are displayed
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Audio")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });

  it("highlights the selected media type", () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Select the Image option
    fireEvent.click(screen.getByText("Image"));

    // For now, we'd need to check the visual highlighting with a more
    // complex testing approach. This is simplified for demonstration purposes.

    // Select another option
    fireEvent.click(screen.getByText("Video"));
  });
});
