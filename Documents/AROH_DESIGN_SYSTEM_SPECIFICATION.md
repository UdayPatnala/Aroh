# AROH Design System & Visual Language Specification

- **Specification Version:** v2.0.0
- **Status:** Active Standard
- **Package:** `@aroh/ads` (`src/tokens/`, `src/components/`)
- **Author:** AROH Design & Experience Team

---

## 1. Visual Philosophy & Aesthetics

AROH delivers a premium, high-contrast, modern digital platform aesthetic centered on **zinc dark modes**, **gold/amber gradients**, **glassmorphism** (`backdrop-blur`), and **restrained motion**.

### Core Visual Tenets
1. **Clarity Over Decoration:** Interfaces prioritize visual hierarchy, clean contrast ratios (WCAG AAA), and predictable spatial grids.
2. **Restrained Motion:** Animations communicate state transitions (loading, focus, drawer toggles) and never delay user interactions.
3. **Glassmorphism Layering:** Dark translucent surfaces (`rgba(24, 24, 27, 0.75)`) elevated over subtle radial glows.

---

## 2. Centralized Design Tokens (`@aroh/ads/tokens`)

```typescript
export const colors = {
  bg: { base: "#09090b", surface: "#18181b", elevated: "#27272a", glass: "rgba(24, 24, 27, 0.75)" },
  border: { subtle: "rgba(255, 255, 255, 0.1)", default: "rgba(255, 255, 255, 0.15)", focus: "#f59e0b" },
  accent: { gold: "#f59e0b", goldHover: "#d97706", goldGlow: "rgba(245, 158, 11, 0.2)", cyan: "#06b6d4", purple: "#a855f7" },
  text: { primary: "#f4f4f5", secondary: "#a1a1aa", muted: "#71717a", inverse: "#09090b" }
};
```

---

## 3. Component Primitives

### 3.1. Button Component (`<Button />`)
- **Variants:** `primary` (gold gradient), `secondary` (zinc-800), `glass` (translucent backdrop), `outline`, `danger`.
- **Sizes:** `sm` (px-3 py-1.5), `md` (px-4 py-2), `lg` (px-6 py-3).
- **Accessibility:** `aria-disabled`, `aria-busy`, visible focus ring (`focus-visible:ring-2 focus-visible:ring-amber-500`).

### 3.2. Badge Component (`<Badge />`)
- **Variants:** `info`, `success`, `warning`, `error`, `gold`, `purple`, `cyan`, `neutral`.
- **Options:** `dot` indicator for real-time status telemetry.

---

## 4. Layout & Responsive Breakpoints

- **Mobile:** Single-column stacked cards, full-width drawers (`< 640px`).
- **Tablet:** 2-column grid, persistent bottom/top nav (`640px - 1024px`).
- **Desktop:** Multi-column dashboard grid with collapsible sidebar, floating command palette (`> 1024px`).
