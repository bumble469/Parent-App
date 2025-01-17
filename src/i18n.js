import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import ur from './locales/ur.json';
import gj from './locales/gj.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    ur: { translation: ur},
    gj: { translation: gj}
  
  },
  lng: 'en', 
  fallbackLng: 'en', 
  interpolation: {
    escapeValue: false 
  }
});

export default i18n;