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
