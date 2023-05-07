import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '/src/assets/locales/eng/translation.json'
import translationESP from '/src/assets/locales/esp/translation.json'


const resources = {
    en: {
        translation: translationEN,
    },
    es : {
        translation: translationESP
    }
}

const availableLanguages = ['eng', 'esp'];

const options = {
    order : ['localStorage', 'querystring', 'navigator'],
}

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        debug: options,
        fallbackLng: 'esp',
        supportedLanguages: ['es', 'en'],
        whitelist: availableLanguages,
        interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
        },
        resources,
    });

export default i18n;