import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1920px",
      },
      colors: {
        content: "#0E0E0E",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#0E0E0E",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#9F71FF",
            },
            focus: "#9F71FF",
          },
        },
        dark: {
          colors: {
            background: "#1A1A1A",
            foreground: "#ECEDEE",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#9F71FF",
            },
            focus: "#9F71FF",
            default: {
              50: "#1A1A1A",
              100: "#0F0F0F",
              200: "#3F3F3F",
              300: "#515151",
              400: "#636363",
              500: "#757575",
              600: "#878787",
              700: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};
