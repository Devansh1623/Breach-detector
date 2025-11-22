import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationZH from './locales/zh/translation.json';
import translationJA from './locales/ja/translation.json';
import translationHI from './locales/hi/translation.json';
import translationAR from './locales/ar/translation.json';
import translationPT from './locales/pt/translation.json';
import translationRU from './locales/ru/translation.json';

const resources = {
    en: { translation: translationEN },
    es: { translation: translationES },
    fr: { translation: translationFR },
    de: { translation: translationDE },
    zh: { translation: translationZH },
    ja: { translation: translationJA },
    hi: { translation: translationHI },
    ar: { translation: translationAR },
    pt: { translation: translationPT },
    ru: { translation: translationRU },
};

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n to react-i18next
    .init({
        resources,
        fallbackLng: 'en', // Fallback language
        debug: false,
        interpolation: {
            escapeValue: false, // React already escapes
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;
