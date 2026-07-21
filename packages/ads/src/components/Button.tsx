import * as React from "react";
import { clsx } from "clsx";
import { accessibility } from "../tokens";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        aria-busy={isLoading}
        className={clsx(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]",
          accessibility.focusRing,
          {
            "px-3 py-1.5 text-xs rounded-lg": size === "sm",
            "px-4 py-2 text-sm rounded-xl": size === "md",
            "px-6 py-3 text-base rounded-2xl": size === "lg",
          },
          {
            // Primary: dark navy — the main action call-to-action
            "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/10 border border-slate-900":
              variant === "primary",
            // Secondary: clean white with slate border
            "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm":
              variant === "secondary",
            // Glass: frosted white
            "bg-white/80 backdrop-blur-md border border-black/10 text-slate-700 hover:bg-white hover:border-slate-300 shadow-sm":
              variant === "glass",
            // Outline: transparent with slate border
            "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400":
              variant === "outline",
            // Danger: rose/red
            "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-sm":
              variant === "danger"
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
