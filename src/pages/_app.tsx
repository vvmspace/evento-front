import { appWithTranslation, useTranslation } from "next-i18next";
import React, { FC, useState } from "react";
import styles from "./../components/Layout/Layout.module.css";
import { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import globalStyles from "../styles/Global.module.css";
import Head from "next/head";
import LanguageSwitcher from "@/components/Layout/LanguageSwitcher/LanguageSwitcher";

const languages = [
  {
    code: "en",
    name: "EN",
    footerText: "© Event Show 2023",
    flags: ["🇺🇸", "🇬🇧"],
    domain: "en.evento.show",
  },
  {
    code: "es",
    name: "ES",
    footerText: "© Evento Show 2023",
    flags: ["🇪🇸", "🇲🇽", "🇦🇷"],
    domain: "evento.show",
  },
  {
    code: "fr",
    name: "FR",
    footerText: "© Spectacle Événement 2023",
    flags: ["🇫🇷"],
    domain: "billets.shop",
  },
];

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const { t, i18n } = useTranslation("common");
  const [currentLang] = useState(
    languages.find((lang) => lang.code === i18n.language) || languages[1],
  );
  const router = useRouter();

  const renderSiteName = () => {
    if (router.pathname === "/") {
      return <span className={globalStyles.logoWrapper}>{t("site_name")}</span>;
    }
    return (
      <Link className={globalStyles.logoWrapper} href="/">
        {t("site_name")}
      </Link>
    );
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://evento.show/${router.asPath}`} />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>{renderSiteName()}</h1>
          <div>
            <LanguageSwitcher
              currentLang={currentLang.code}
              languages={languages}
              titles={{
                en:
                  pageProps.events?.[0]?.title?.en ||
                  "Tickets for Concerts, Festivals, Sports, Theatre and More",
                es:
                  pageProps.events?.[0]?.title?.es ||
                  "Entradas para Conciertos, Festivales, Deportes, Teatro y Más",
                fr:
                  pageProps.events?.[0]?.title?.fr ||
                  "Billets pour Concerts, Festivals, Sports, Théâtre et Plus",
              }}
            />
          </div>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
        <footer className={styles.footer}>{currentLang.footerText}</footer>
      </div>
    </>
  );
};

export default appWithTranslation(MyApp);
