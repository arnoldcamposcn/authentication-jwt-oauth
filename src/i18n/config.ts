// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import esTranslations from './es.json';
import enTranslations from './en.json';

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources: {
      es: {
        translation: esTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'es', // Idioma por defecto
    interpolation: {
      escapeValue: false, // React ya escapa valores
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;