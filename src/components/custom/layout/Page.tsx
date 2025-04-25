import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Container } from "./Container";

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function Page({
  children,
  title,
  description,
  className,
  ...props
}: PageProps) {
  return (
    <div
      data-testid="page-container"
      className={cn("py-6 md:py-8", className)}
      {...props}
    >
      <Container>
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </header>
        <main>{children}</main>
      </Container>
    </div>
  );
}
