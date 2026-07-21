import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import auth from '@/locales/en/auth.json';
import home from '@/locales/en/home.json';
import profile from '@/locales/en/profile.json';
import friends from '@/locales/en/friends.json';
import notifications from '@/locales/en/notifications.json';
import lists from '@/locales/en/lists.json';
import randomizer from '@/locales/en/randomizer.json';
import errors from '@/locales/en/errors.json';
import groups from '@/locales/en/groups.json';
import navigation from '@/locales/en/navigation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  resources: {
    en: { auth, home, profile, friends, notifications, lists, randomizer, errors, groups, navigation },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
