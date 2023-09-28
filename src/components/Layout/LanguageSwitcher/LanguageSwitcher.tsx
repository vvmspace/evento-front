// components/Layout/LanguageSwitcher.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/components/Layout/Layout.module.css";
import { Language } from "@/types/language.type";
import { useAmp } from "next/amp";
import group from "@/pages/[group]";

type LanguageSwitcherProps = {
  currentLang: string;
  languages: Language[];
  titles: { [key: string]: string };
  link?: string;
  group?: string;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  languages,
  titles,
  link,
  group,
}) => {
  const isAmp = useAmp();
  const [flags, setFlags] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newFlags: { [key: string]: string } = {};
    languages.forEach((lang) => {
      const flagsForLang = lang.flags;
      if (flagsForLang) {
        newFlags[lang.code] =
          flagsForLang[Math.floor(Math.random() * flagsForLang.length)];
      }
    });
    setFlags(newFlags);
  }, [languages]);

  return (
    <div>
      {languages.map((lang) => {
        const flag = flags[lang.code];
        if (lang.code === currentLang) {
          return (
            <span
              key={lang.code}
              style={
                isAmp
                  ? {
                      display: "inline-block",
                      textDecoration: "none",
                      color: "#006fbb",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      margin: "0 0.5rem",
                    }
                  : {}
              }
              className={styles.langButtonActive}
            >
              {flag}
              <span className={styles.langCode}>{lang.code}</span>
            </span>
          );
        } else {
          return (
            <Link
              key={lang.code}
              href={`https://${lang.domain}${link && !link?.includes('[') ? link : group && !group?.includes('[') ? group : ''}`}
              passHref
              title={titles[lang.code]}
              className={styles.langButton}
              style={
                isAmp
                  ? {
                      display: "inline-block",
                      textDecoration: "none",
                      color: "#006fbb",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      padding: "0 0.5rem",
                      margin: "0 0.5rem",
                      borderRadius: "5px",
                      boxShadow: "1px 1px 1px 1px #ccc",
                    }
                  : {}
              }
            >
              {flag}
              <span className={styles.langCode}>{lang.code}</span>
            </Link>
          );
        }
      })}
    </div>
  );
};

export default LanguageSwitcher;
