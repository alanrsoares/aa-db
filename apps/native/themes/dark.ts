import type { Theme } from "./light";

export const darkTheme = {
  colors: {
    // Primary colors
    primary: "theme(colors.blue.400)",

    // Semantic colors
    success: "theme(colors.green.400)",
    "success-light": "theme(colors.green.800)",
    "success-dark": "theme(colors.green.200)",

    danger: "theme(colors.red.400)",
    "danger-light": "theme(colors.red.800)",
    "danger-dark": "theme(colors.red.200)",

    warning: "theme(colors.yellow.400)",
    "warning-light": "theme(colors.yellow.800)",
    "warning-dark": "theme(colors.yellow.200)",
    "warning-darker": "theme(colors.yellow.100)",

    info: "theme(colors.blue.400)",
    "info-light": "theme(colors.blue.800)",
    "info-dark": "theme(colors.blue.200)",
    "info-darker": "theme(colors.blue.100)",

    // Neutral colors
    neutral: "theme(colors.gray.700)",
    "neutral-light": "theme(colors.gray.800)",
    "neutral-dark": "theme(colors.gray.600)",
    "neutral-darker": "theme(colors.gray.500)",

    // Text colors
    "text-primary": "theme(colors.gray.100)",
    "text-secondary": "theme(colors.gray.200)",
    "text-tertiary": "theme(colors.gray.300)",
    "text-muted": "theme(colors.gray.400)",
    "text-white": "theme(colors.white)",

    // Background colors
    background: "theme(colors.gray.900)",
    "background-secondary": "theme(colors.gray.800)",
  },
} satisfies Theme;
