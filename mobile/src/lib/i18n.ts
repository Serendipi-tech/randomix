import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import auth from '@/locales/en/auth.json';
import home from '@/locales/en/home.json';
import social from '@/locales/en/social.json';
import settings from '@/locales/en/settings.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  resources: {
    en: { auth, home, social, settings },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
