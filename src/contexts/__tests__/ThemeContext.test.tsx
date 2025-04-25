import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";

// Test component that uses the theme context
function ThemeConsumer() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-mode">{isDarkMode ? "dark" : "light"}</div>
      <button data-testid="theme-toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    // Reset localStorage between tests
    localStorage.clear();
  });

  it("should default to light theme when no saved theme exists", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
  });

  it("should use saved theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
  });

  it("should toggle theme when toggle button is clicked", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Initial theme should be light
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

    // Click the toggle button
    fireEvent.click(screen.getByTestId("theme-toggle"));

    // Theme should now be dark
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");

    // LocalStorage should be updated
    expect(localStorage.getItem("theme")).toBe("dark");

    // Click the toggle button again
    fireEvent.click(screen.getByTestId("theme-toggle"));

    // Theme should be back to light
    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");

    // LocalStorage should be updated
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
