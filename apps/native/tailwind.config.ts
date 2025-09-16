import type { Config } from "tailwindcss";

import { darkTheme } from "./themes/dark";
import { lightTheme } from "./themes/light";

export default {
  content: ["./App.{js,ts,tsx}", "src/{components,screens}/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")], // eslint-disable-line @typescript-eslint/no-require-imports
  darkMode: "class", // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      ...darkTheme,
    },
  },
  plugins: [],
} satisfies Config;
