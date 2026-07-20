import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import auth from '@/locales/en/auth.json';
import home from '@/locales/en/home.json';
import social from '@/locales/en/social.json';
import settings from '@/locales/en/settings.json';
import lists from '@/locales/en/lists.json';
import randomizer from '@/locales/en/randomizer.json';
import errors from '@/locales/en/errors.json';
import groups from '@/locales/en/groups.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  resources: {
    en: { auth, home, social, settings, lists, randomizer, errors, groups },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
