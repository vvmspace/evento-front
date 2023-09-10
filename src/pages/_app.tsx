import { appWithTranslation, useTranslation } from 'next-i18next';
import React, {FC, useState} from 'react';
import styles from './../components/Layout/Layout.module.css';
import {AppProps} from "next/app";

type Language = {
    code: string;
    name: string;
    footerText: string;
}
const languages = [
    { code: 'en', name: 'EN', footerText: '© Event Show 2023' },
    { code: 'es', name: 'ES', footerText: '© Evento Show 2023' },
    { code: 'fr', name: 'FR', footerText: '© Spectacle Événement 2023' },
];

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
    const { t, i18n } = useTranslation('common');
    const [currentLang, setCurrentLang]
        = useState(languages
        .find(lang => lang.code === i18n.language) || languages[1]);

    const changeLanguage = (lng: Language) => {
        i18n.changeLanguage(lng.code);
        setCurrentLang(lng);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t('site_name')}</h1>
                <div>
                    {languages.map(lang => (
                        <button key={lang.code} onClick={() => changeLanguage(lang)}>
                            {lang.name}
                        </button>
                    ))}
                </div>
            </header>
            <main>
                <Component {...pageProps} />
            </main>
            <footer className={styles.footer}>
                {currentLang.footerText}
            </footer>
        </div>
    );
}

export default appWithTranslation(MyApp);
