import { appWithTranslation, useTranslation } from 'next-i18next';
import React, { FC, useState } from 'react';
import styles from './../components/Layout/Layout.module.css';
import { AppProps } from "next/app";
import Link from 'next/link';
import { useRouter } from 'next/router';
import globalStyles from '../styles/Global.module.css';
import Head from "next/head";

type Language = {
    code: string;
    name: string;
    footerText: string;
    flag: string;
}
const languages = [
    { code: 'en', name: 'EN', footerText: '© Event Show 2023', flag: '🇺🇸' },
    { code: 'es', name: 'ES', footerText: '© Evento Show 2023', flag: '🇪🇸' },
    { code: 'fr', name: 'FR', footerText: '© Spectacle Événement 2023', flag: '🇫🇷' }
];

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
    const { t, i18n } = useTranslation('common');
    const [currentLang, setCurrentLang]
        = useState(languages
        .find(lang => lang.code === i18n.language) || languages[1]);
    const router = useRouter();

    const changeLanguage = (lng: Language) => {
        i18n.changeLanguage(lng.code);
        setCurrentLang(lng);
    };

    const renderSiteName = () => {
        if (router.pathname === '/') {
            return <span className={globalStyles.logoWrapper}>{t('site_name')}</span>;
        }
        return (
            <Link className={globalStyles.logoWrapper} href="/">
                {t('site_name')}
            </Link>
        );
    }

    return (<>
        <Head>
            <link rel="canonical" href={`https://evento.show/${router.asPath}`} />
        </Head>
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{renderSiteName()} {pageProps.events?.[0]?.name[i18n.language]}</h1>
                <div>
                    {languages.map(lang => (
                        <button className={[styles.langButton, lang.code === currentLang.code ? styles.active : ''].join(' ')} key={lang.code} onClick={() => changeLanguage(lang)}>{lang.flag}{lang.code}</button>
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
        </>);
}

export default appWithTranslation(MyApp);
