// src/i18n/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // Conectar i18next con React
  .init({
    lng: "es", // Idioma predeterminado
    fallbackLng: "es", // Si no hay traducción disponible, usa español
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar los valores
    },
    resources: {
      es: {
        translation: {
          greetingStart: "Haz",
          greetingHighlight: "hermosos",
          greetingEnd: "sitios web sin importar tu experiencia en diseño.",
          description: "Hermosa, rápida y moderna biblioteca de UI para React.",
          docs: "Documentación",
          github: "GitHub",
          snippet: "Comienza editando <code>pages/index.tsx</code>",
        },
      },
      en: {
        translation: {
          greetingStart: "Make",
          greetingHighlight: "beautiful",
          greetingEnd: "websites regardless of your design experience.",
          description: "Beautiful, fast and modern React UI library.",
          docs: "Documentation",
          github: "GitHub",
          snippet: "Get started by editing <code>pages/index.tsx</code>",
        },
      },
    },
  });

export default i18n;
