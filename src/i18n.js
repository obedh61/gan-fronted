import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import axios from 'axios';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'he', // Hebrew default when nothing is stored/detected
    supportedLngs: ['he', 'en'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/translation.json`,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

// Send the current UI language to the backend on every request
axios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['Accept-Language'] = i18n.language || 'he';
  return config;
});

export default i18n;
