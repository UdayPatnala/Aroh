import * as React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "error" | "gold" | "purple" | "cyan" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full border transition-colors",
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-1 text-xs": size === "md",
        },
        {
          "bg-blue-500/10 text-blue-400 border-blue-500/20": variant === "info",
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20": variant === "success",
          "bg-amber-500/10 text-amber-400 border-amber-500/20": variant === "warning" || variant === "gold",
          "bg-red-500/10 text-red-400 border-red-500/20": variant === "error",
          "bg-purple-500/10 text-purple-400 border-purple-500/20": variant === "purple",
          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20": variant === "cyan",
          "bg-zinc-800/80 text-zinc-300 border-zinc-700/50": variant === "neutral"
        },
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx("mr-1.5 h-1.5 w-1.5 rounded-full", {
            "bg-blue-400": variant === "info",
            "bg-emerald-400": variant === "success",
            "bg-amber-400": variant === "warning" || variant === "gold",
            "bg-red-400": variant === "error",
            "bg-purple-400": variant === "purple",
            "bg-cyan-400": variant === "cyan",
            "bg-zinc-400": variant === "neutral"
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
