// components/Layout/LanguageSwitcher.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/Layout/Layout.module.css";
import { Language } from "@/types/language.type";

type LanguageSwitcherProps = {
  currentLang: string;
  languages: Language[];
  titles: { [key: string]: string };
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
                                                             currentLang,
                                                             languages,
                                                             titles,
                                                           }) => {
  const router = useRouter();
  const [flags, setFlags] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newFlags: { [key: string]: string } = {};
    languages.forEach(lang => {
      const flagsForLang = lang.flags;
      if (flagsForLang) {
        newFlags[lang.code] = flagsForLang[Math.floor(Math.random() * flagsForLang.length)];
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
                <span key={lang.code} className={styles.active}>
              {flag} {lang.code}
            </span>
            );
          } else {
            return (
                <Link
                    key={lang.code}
                    href={`https://${lang.domain}${router.asPath}`}
                    passHref
                    title={titles[lang.code]}
                >
                  <span title={titles[lang.code]} className={styles.langButton}>
                    {flag} {lang.code}
                  </span>
                </Link>
            );
          }
        })}
      </div>
  );
};

export default LanguageSwitcher;
