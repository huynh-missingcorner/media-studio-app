import { useState } from "react";
import { SignupForm } from "@/components/custom/auth/SignupForm";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthHeader } from "@/components/custom/layout/AuthHeader";

export function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signup, error: authError } = useAuth();

  // Use auth error from the store if available
  const displayError = error || authError;

  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      await signup(data);
      navigate("/dashboard"); // Redirect to dashboard after successful registration
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {displayError && (
            <div className="mb-4 p-4 text-sm text-white bg-red-500 rounded-md">
              {displayError}
            </div>
          )}

          <SignupForm onSubmit={handleSignup} />

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
