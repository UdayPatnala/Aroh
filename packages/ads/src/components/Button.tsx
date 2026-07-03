import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          {
            "bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:shadow-lg hover:shadow-amber-500/20":
              variant === "primary",
            "bg-zinc-800 text-white hover:bg-zinc-700": variant === "secondary",
            "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20":
              variant === "glass",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
