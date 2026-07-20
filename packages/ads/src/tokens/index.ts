export const colors = {
  bg: {
    base: "#09090b", // zinc-950
    surface: "#18181b", // zinc-900
    elevated: "#27272a", // zinc-800
    glass: "rgba(24, 24, 27, 0.75)"
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.1)",
    default: "rgba(255, 255, 255, 0.15)",
    focus: "#f59e0b" // amber-500
  },
  accent: {
    gold: "#f59e0b", // amber-500
    goldHover: "#d97706", // amber-600
    goldGlow: "rgba(245, 158, 11, 0.2)",
    cyan: "#06b6d4",
    purple: "#a855f7"
  },
  text: {
    primary: "#f4f4f5", // zinc-100
    secondary: "#a1a1aa", // zinc-400
    muted: "#71717a", // zinc-500
    inverse: "#09090b"
  },
  status: {
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    info: "#3b82f6"
  }
} as const;

export const typography = {
  fontFamily: {
    sans: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
    mono: "'Fira Code', 'JetBrains Mono', monospace"
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem"
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
} as const;

export const motion = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms"
  },
  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)"
  }
} as const;

export const accessibility = {
  focusRing: "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
  screenReaderOnly: "sr-only"
} as const;

export const designTokens = {
  colors,
  typography,
  motion,
  accessibility
} as const;

export type DesignTokens = typeof designTokens;
