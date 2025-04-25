import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";

// Create a custom render function that includes common providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

function AllTheProviders({
  children,
  route = "/",
}: {
  children: React.ReactNode;
  route?: string;
}) {
  // Set the initial window.location
  window.history.pushState({}, "Test page", route);

  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}

function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  const { route, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} route={route} />,
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render method
export { customRender as render };
