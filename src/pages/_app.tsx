import React, { CSSProperties, FC, useState } from "react";
import styles from "./../components/Layout/Layout.module.css";
import { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import globalStyles from "../styles/Global.module.css";
import Head from "next/head";
import LanguageSwitcher from "@/components/Layout/LanguageSwitcher/LanguageSwitcher";
import { t } from "@/libs/t";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { useAmp } from "next/amp";

const languages = [
  {
    code: "en",
    name: "EN",
    footerText: "© Some Ticket 2023",
    flags: ["🇺🇸", "🇬🇧"],
    domain: "someticket.com",
  },
  {
    code: "am",
    name: "AM",
    footerText: "© Միայն տոմսեր 2023",
    flags: ["🇦🇲"],
    domain: "am.someticket.com",
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
  const isAmp = useAmp();
  const [currentLang] = useState(
    languages.find(
      (lang) => lang.code === process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE,
    ) || languages[1],
  );
  const router = useRouter();

  const ampLogoStyle: CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textDecoration: "none",
    textTransform: "uppercase",
    color: "#006fbb",
  };
  const renderSiteName = () => {
    if (router.pathname === "/") {
      return (
        <span
          className={globalStyles.logoWrapper}
          style={isAmp ? ampLogoStyle : {}}
        >
          {t("site_name")}
        </span>
      );
    }
    return (
      <Link
        className={globalStyles.logoWrapper}
        style={isAmp ? ampLogoStyle : {}}
        href="/"
      >
        {t("site_name")}
      </Link>
    );
  };

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`${
            process.env.URL_PREFIX || process.env.NEXT_PUBLIC_URL_PREFIX
          }${pageProps.link ?? router.asPath.replaceAll('?amp=1', '')}`}
        />
        <link
          rel="amphtml"
          href={`${
            process.env.URL_PREFIX || process.env.NEXT_PUBLIC_URL_PREFIX
          }${pageProps.link ?? router.asPath}?amp=1`}
        />
      </Head>
      <div className={globalStyles.container}>
        <header>
          <div className={styles.header}>
            <div>{renderSiteName()}</div>
            <div>
              <LanguageSwitcher
                currentLang={currentLang.code}
                languages={languages}
                link={pageProps.link ?? router.asPath}
                titles={{
                  en:
                    pageProps.event?.title?.en ||
                    "Tickets for Concerts, Festivals, Sports, Theatre and More",
                  es:
                    pageProps.event?.title?.es ||
                    "Entradas para Conciertos, Festivales, Deportes, Teatro y Más",
                  fr:
                    pageProps.event?.title?.fr ||
                    "Billets pour Concerts, Festivals, Sports, Théâtre et Plus",
                }}
              />
            </div>
          </div>
        </header>
        <main>
          <GoogleAnalytics trackPageViews />
          <Component {...pageProps} />
        </main>
        <footer className={styles.footer}>
          {pageProps.groups && (
              <div className={styles.groups}>
                {pageProps.groups.map((group: {
                  alias: string;
                  name: string;
                }) => (
                    <Link
                        href={`/${group.alias}`}
                        key={group.alias}
                        locale={currentLang.code}
                        className={styles.groupLink}
                    >{group?.name || ''}</Link>
                ))}
              </div>
          )}
          {currentLang.footerText}</footer>
      </div>
    </>
  );
};

export default MyApp;
