import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Layout({ children, className, ...props }: LayoutProps) {
  return (
    <div
      data-testid="layout-container"
      className={cn("min-h-screen bg-background", className)}
      {...props}
    >
      {children}
    </div>
  );
}
