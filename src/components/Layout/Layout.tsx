import React from 'react';
import { useTranslation } from 'next-i18next';
import styles from './Layout.module.css';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
    const { t, i18n } = useTranslation('common');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t('site_name')}</h1>
                <div>
                    <button onClick={() => i18n.changeLanguage('en')}>EN</button>
                    <button onClick={() => i18n.changeLanguage('es')}>ES</button>
                    <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
                </div>
            </header>
            <main>{children}</main>
            <footer className={styles.footer}>
                © Evento Show 2023
            </footer>
        </div>
    );
}

export default Layout;
