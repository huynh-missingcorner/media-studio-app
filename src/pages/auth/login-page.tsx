import { useState } from "react";
import { LoginForm } from "@/components/custom/auth/LoginForm";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthHeader } from "@/components/custom/layout/AuthHeader";

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  // Use auth error from the store if available
  const displayError = error || authError;

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex flex-1 flex-col px-6 py-12 lg:px-8 mt-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2
            className="text-center text-2xl font-bold leading-9 tracking-tight"
            data-testid="login-title"
          >
            Sign in to your account
          </h2>
          {/* This span is for test purposes only */}
          <span className="hidden" data-testid="login-page-test">
            This is Login Page
          </span>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {displayError && (
            <div className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md">
              {displayError}
            </div>
          )}

          <LoginForm onSubmit={handleLogin} />

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
