/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "src/{components,screens}/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  darkMode: "class", // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      colors: {
        primary: "rgb(59 130 246 / var(--tw-bg-opacity, 1));",
      },
    },
  },
  plugins: [],
};
