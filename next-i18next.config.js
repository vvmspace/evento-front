const path = require('path');

module.exports = {
    i18n: {
        defaultLocale: process.env.locale ?? 'es', // Испанский по умолчанию
        locales: ['en', 'es', 'fr'],
        localePath: path.resolve('./public/locales'),
        domainLocales: [
            {
                domain: 'evento.show',
                defaultLocale: 'es',
            },
            {
                domain: 'billets.shop',
                defaultLocale: 'fr',
            },
            {
                domain: 'en.event.show',
                defaultLocale: 'en',
            },
            {
                domain: 'it.event.show',
                defaultLocale: 'it',
            }
        ]
    },
};
