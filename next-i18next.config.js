const path = require('path');

module.exports = {
    i18n: {
        defaultLocale: process.env.locale ?? 'es', // Испанский по умолчанию
        locales: ['en', 'es', 'fr'],
    }
};
