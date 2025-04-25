import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MediaTypeCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function MediaTypeCard({
  icon,
  title,
  description,
  onClick,
}: MediaTypeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 rounded-xl transition-all cursor-pointer hover:shadow-md",
        "border border-border bg-background hover:bg-primary/20 hover:border-primary/20"
      )}
      onClick={onClick}
    >
      <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center">
          {description}
        </p>
      )}
    </div>
  );
}
