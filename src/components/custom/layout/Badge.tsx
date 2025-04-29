export const Badge = ({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) => (
  <div
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
      ${
        variant === "secondary"
          ? "bg-secondary text-secondary-foreground"
          : "bg-primary text-primary-foreground"
      }
      ${className || ""}`}
  >
    {children}
  </div>
);
