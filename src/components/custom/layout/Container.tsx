import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: ContainerMaxWidth;
}

export function Container({
  children,
  className,
  maxWidth,
  ...props
}: ContainerProps) {
  return (
    <div
      data-testid="container"
      className={cn(
        "container mx-auto px-4 md:px-6",
        {
          "max-w-screen-sm": maxWidth === "sm",
          "max-w-screen-md": maxWidth === "md",
          "max-w-screen-lg": maxWidth === "lg",
          "max-w-screen-xl": maxWidth === "xl",
          "max-w-screen-2xl": maxWidth === "2xl",
          "max-w-full": maxWidth === "full",
          "max-w-none": maxWidth === "none",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
