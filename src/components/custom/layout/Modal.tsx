import { cn } from "@/lib/utils";
import { HTMLAttributes, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({
  children,
  isOpen,
  onClose,
  title,
  className,
  ...props
}: ModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        data-testid="modal-overlay"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
          "relative animate-in fade-in duration-300",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        {...props}
      >
        <div className="flex items-start justify-between">
          {title && (
            <h2 id="modal-title" className="text-xl font-semibold">
              {title}
            </h2>
          )}

          <button
            type="button"
            className="ml-auto -mr-2 -mt-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
