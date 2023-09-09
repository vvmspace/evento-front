const { i18n } = require('./next-i18next.config');
process.env.I18NEXT_DEFAULT_CONFIG_PATH = `${__dirname}/next-i18next.config.js`;
/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n
};

module.exports = nextConfig;
