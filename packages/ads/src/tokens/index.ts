export const colors = {
  bg: {
    base: "#fbfbfa", // ultra-clean light cream
    surface: "#ffffff",
    elevated: "#f1f5f9",
    glass: "rgba(255, 255, 255, 0.85)"
  },
  border: {
    subtle: "rgba(0, 0, 0, 0.06)",
    default: "rgba(0, 0, 0, 0.1)",
    focus: "#0284c7" // sky-600
  },
  accent: {
    sky: "#0284c7",
    skyHover: "#0369a1",
    skyGlow: "rgba(2, 132, 199, 0.12)",
    dark: "#0f172a"
  },
  text: {
    primary: "#0f172a", // slate-900
    secondary: "#475569", // slate-600
    muted: "#94a3b8", // slate-400
    inverse: "#ffffff"
  },
  status: {
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb"
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
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  }
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem"
} as const;

export const accessibility = {
  focusRing: "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  touchTarget: "min-h-[44px] min-w-[44px]"
} as const;
