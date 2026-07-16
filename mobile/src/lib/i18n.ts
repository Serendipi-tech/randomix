import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import auth from '@/locales/en/auth.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  resources: {
    en: { auth },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
