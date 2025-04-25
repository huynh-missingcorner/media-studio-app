import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils";
import { LoginPage } from "../login-page";

describe("LoginPage", () => {
  it("renders the login page", () => {
    render(<LoginPage />);

    // Check that the login page title is displayed
    expect(screen.getByTestId("login-page-test")).toHaveTextContent(
      "This is Login Page"
    );
  });

  // Add more tests as LoginPage is implemented with form fields, submit button, validation, etc.
});
