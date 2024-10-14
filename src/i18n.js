import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: require('./locales/en/translation.json'),
      },
      am: {
        translation: require('./locales/am/translation.json'),
      },
    },
    lng: 'am', // default language
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
