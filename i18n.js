const i18n = require('i18next');
const Backend = require('i18next-fs-backend');
const { initReactI18next } = require('react-i18next');

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: process.env.locale ?? 'es',
        fallbackLng: process.env.locale ?? 'es',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
    });

module.exports.i18n = i18n;