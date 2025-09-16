import type { Config } from "tailwindcss";

export default {
  content: ["./App.{js,ts,tsx}", "src/{components,screens}/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")], // eslint-disable-line @typescript-eslint/no-require-imports
  darkMode: "class", // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: "theme(colors.blue.500)",

        // Semantic colors
        success: "theme(colors.green.500)",
        "success-light": "theme(colors.green.100)",
        "success-dark": "theme(colors.green.700)",

        danger: "theme(colors.red.500)",
        "danger-light": "theme(colors.red.100)",
        "danger-dark": "theme(colors.red.700)",

        warning: "theme(colors.yellow.500)",
        "warning-light": "theme(colors.yellow.50)",
        "warning-dark": "theme(colors.yellow.700)",
        "warning-darker": "theme(colors.yellow.800)",

        info: "theme(colors.blue.600)",
        "info-light": "theme(colors.blue.50)",
        "info-dark": "theme(colors.blue.700)",
        "info-darker": "theme(colors.blue.800)",

        // Neutral colors
        neutral: "theme(colors.gray.200)",
        "neutral-light": "theme(colors.gray.100)",
        "neutral-dark": "theme(colors.gray.300)",
        "neutral-darker": "theme(colors.gray.400)",

        // Text colors
        "text-primary": "theme(colors.gray.800)",
        "text-secondary": "theme(colors.gray.700)",
        "text-tertiary": "theme(colors.gray.600)",
        "text-muted": "theme(colors.gray.500)",
        "text-white": "theme(colors.white)",

        // Background colors
        background: "theme(colors.white)",
        "background-secondary": "theme(colors.gray.100)",
      },
    },
  },
  plugins: [],
} satisfies Config;
