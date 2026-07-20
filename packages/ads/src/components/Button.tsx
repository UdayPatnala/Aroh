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
          "inline-flex items-center justify-center font-medium transition-all duration-250 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-98",
          accessibility.focusRing,
          {
            "px-3 py-1.5 text-xs rounded-md": size === "sm",
            "px-4 py-2 text-sm rounded-lg": size === "md",
            "px-6 py-3 text-base rounded-xl": size === "lg",
          },
          {
            "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/20 font-semibold":
              variant === "primary",
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/50":
              variant === "secondary",
            "bg-zinc-900/60 backdrop-blur-md border border-white/10 text-zinc-100 hover:bg-zinc-800/80 hover:border-amber-500/30":
              variant === "glass",
            "bg-transparent text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-400":
              variant === "outline",
            "bg-red-600/90 text-white hover:bg-red-500 border border-red-500/30":
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
