import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label text-[var(--color-fg-secondary)] mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex w-full min-h-[120px] px-4 py-4 bg-[var(--color-bg-input)] border text-body text-[var(--color-fg-primary)] resize-y",
            "placeholder:text-[var(--color-fg-placeholder)]",
            "transition-all duration-150",
            "focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-subtle)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-secondary)]",
            error
              ? "border-[var(--color-error)] bg-[var(--color-error-subtle)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]",
            "rounded-[var(--radius-md)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-body-sm text-[var(--color-error)] flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-body-sm text-[var(--color-fg-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
