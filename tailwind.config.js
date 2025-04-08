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
            background: "#FFFFFF", // or DEFAULT
            foreground: "#0E0E0E", // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#9F71FF",
            },
            focus: "#9F71FF",
          },
        },
        dark: {
          colors: {
            background: "#1A1A1A", // or DEFAULT
            foreground: "#ECEDEE", // or 50 to 900 DEFAULT
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#9F71FF",
            },
            focus: "#9F71FF",
            default: {
              100: "#0E0E0E",
              200: "#1A1A1A",
              300: "#2D2D2D",
              400: "#3F3F3F",
              500: "#515151",
              600: "#636363",
            },
          },
        },
      },
    }),
  ],
};
