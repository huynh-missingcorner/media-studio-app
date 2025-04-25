import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { X } from "lucide-react";

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "default",
  onClose,
  className,
  ...props
}: ToastProps) {
  const variants = {
    default: "bg-white border-gray-200 text-gray-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      data-testid="toast"
      className={cn(
        "p-4 rounded-md shadow-md border flex items-center justify-between",
        variants[type],
        className
      )}
      role="alert"
      {...props}
    >
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
