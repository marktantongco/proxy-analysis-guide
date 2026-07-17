// ── Cascade Palette & Shared Color Tokens ──────────────────────────────
// ui-ux-pro-max design system — single source of truth for all color values.

export const palette = {
  header: "#6b634d",
  accent: "#92751f",
  accent2: "#5a36c3",
  success: "#3f7450",
  error: "#8b4e49",
  info: "#537ba4",
  warning: "#ae8d4a",
  bg: "#f6f6f6",
  bgDark: "#1a1a1e",
  text: "#151513",
  textDark: "#e8e6e1",
  border: "#d6d1c2",
  borderDark: "#3a3a3e",
  muted: "#86837c",
  mutedDark: "#ae964d",
} as const;

// ── CSS Variable References ────────────────────────────────────────────
// For JavaScript-driven color values (inline styles, SVG fills, dynamic computation).
// Theme-aware: automatically resolves to the correct value in light/dark mode.

export const cssVar = {
  header: "var(--cascade-header)",
  accent: "var(--cascade-accent)",
  accent2: "var(--cascade-accent2)",
  success: "var(--cascade-success)",
  error: "var(--cascade-error)",
  info: "var(--cascade-info)",
  warning: "var(--cascade-warning)",
  muted: "var(--cascade-muted)",
  bg: "var(--background)",
  text: "var(--foreground)",
  border: "var(--border)",
} as const;

export const scoreColor = (score: number): string => {
  if (score >= 8) return palette.success;
  if (score >= 6) return palette.warning;
  return palette.error;
};

export const scoreBg = (score: number): string => {
  if (score >= 8) return `${palette.success}15`;
  if (score >= 6) return `${palette.warning}15`;
  return `${palette.error}15`;
};

// ── Tailwind Class Presets ─────────────────────────────────────────────
// CSS-variable-based classes for automatic dark mode support.
// Cascade-specific colors use the --color-cascade-* theme tokens.

export const tw = {
  // Text colors — semantic CSS variables (auto dark mode)
  textHeader: "text-primary",
  textAccent: "text-accent",
  textAccent2: "text-cascade-accent2",
  textSuccess: "text-cascade-success",
  textError: "text-cascade-error",
  textInfo: "text-cascade-info",
  textWarning: "text-cascade-warning",
  textText: "text-foreground",
  textMuted: "text-muted-foreground",
  textMutedDark: "text-primary",

  // Dark-mode text colors — handled automatically by CSS variables
  darkTextHeader: "",
  darkTextAccent: "",
  darkTextSuccess: "",
  darkTextError: "",
  darkTextInfo: "",
  darkTextWarning: "",
  darkTextText: "",
  darkTextMuted: "",

  // Background colors — semantic CSS variables (auto dark mode)
  bgBg: "bg-background",
  bgBgDark: "bg-background",
  bgCard: "bg-card",
  bgHeader: "bg-primary",
  bgAccent: "bg-accent",
  bgAccent2: "bg-cascade-accent2",
  bgSuccess: "bg-cascade-success",
  bgError: "bg-cascade-error",
  bgInfo: "bg-cascade-info",
  bgWarning: "bg-cascade-warning",

  // Dark-mode background colors — handled automatically by CSS variables
  darkBgBg: "",
  darkBgBgDark: "",
  darkBgCard: "",
  darkBgHover: "",
  darkBgHoverAlt: "",

  // Border colors — semantic CSS variables (auto dark mode)
  borderBorder: "border-border",
  borderBorderDark: "border-border",

  // Dark-mode border colors — handled automatically by CSS variables
  darkBorderBorder: "",

  // Score color classes (Tailwind-specific thresholds)
  scoreText: (score: number): string => {
    if (score >= 9) return "text-cascade-success";
    if (score >= 7.5) return "text-cascade-info";
    if (score >= 6.5) return "text-cascade-warning";
    return "text-cascade-error";
  },
  scoreBg: (score: number): string => {
    if (score >= 9) return "bg-cascade-success/10 border-cascade-success/30";
    if (score >= 7.5) return "bg-cascade-info/10 border-cascade-info/30";
    if (score >= 6.5) return "bg-cascade-warning/10 border-cascade-warning/30";
    return "bg-cascade-error/10 border-cascade-error/30";
  },

  // Button presets
  btnPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
  btnAccent: "bg-accent hover:bg-accent/90 text-accent-foreground",

  // Hover colors
  hoverBgBg: "hover:bg-background",
  hoverBgText: "hover:bg-secondary",
  darkHoverBgBorderDark: "",

  // Background with opacity variants — cascade theme tokens support Tailwind opacity
  bgSuccess5: "bg-cascade-success/5",
  bgSuccess10: "bg-cascade-success/10",
  bgSuccess20: "bg-cascade-success/20",
  bgInfo5: "bg-cascade-info/5",
  bgInfo10: "bg-cascade-info/10",
  bgInfo20: "bg-cascade-info/20",
  bgWarning10: "bg-cascade-warning/10",
  bgError5: "bg-cascade-error/5",
  bgError10: "bg-cascade-error/10",

  // Dark-mode bg with opacity variants — handled automatically
  darkBgSuccess10: "",
  darkBgSuccess20: "",
  darkBgInfo20: "",
  darkBgError10: "",

  // Border with opacity variants
  borderAccent30: "border-accent/30",
  borderInfo30: "border-cascade-info/30",
  borderSuccess30: "border-cascade-success/30",
  borderSuccess40: "border-cascade-success/40",
  borderSuccess20: "border-cascade-success/20",
  borderError30: "border-cascade-error/30",
  borderWarning30: "border-cascade-warning/30",
  borderMutedText: "text-border",
  borderInfo20: "border-cascade-info/20",

  // Dark-mode border with opacity variants — handled automatically
  darkBorderAccent30: "",
  darkBorderSuccess20: "",
  darkBorderSuccess30: "",
  darkBorderInfo20: "",

  // Selected state (category tabs)
  bgHeaderDarkSelected: "",
  textOnAccent: "",

  // Hover variants
  hoverSuccessDark: "hover:bg-cascade-success/80",
  hoverSuccessText: "hover:text-cascade-success",
  hoverErrorText: "hover:text-cascade-error",
  hoverInfoText: "hover:text-cascade-info",
} as const;
