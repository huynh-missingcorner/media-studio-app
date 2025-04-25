import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the schema for form validation
const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define the type for form data
type SignupFormData = z.infer<typeof signupSchema>;
type SignupSubmitData = Omit<SignupFormData, "confirmPassword">;

interface SignupFormProps {
  onSubmit: (data: SignupSubmitData) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitHandler = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      // Remove confirmPassword before submitting
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...submitData } = data;
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            disabled={isSubmitting}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500" data-testid="firstName-error">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            disabled={isSubmitting}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500" data-testid="lastName-error">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-red-500" data-testid="email-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          disabled={isSubmitting}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-red-500" data-testid="password-error">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p
            className="text-sm text-red-500"
            data-testid="confirmPassword-error"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        data-testid="signup-button"
      >
        {isSubmitting ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}
