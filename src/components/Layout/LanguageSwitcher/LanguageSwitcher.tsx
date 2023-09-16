// components/Layout/LanguageSwitcher.tsx
import React from "react";
import Link from "next/link";
import styles from "./Layout.module.css";
import {Language} from "@/types/language.type";

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

    const getFlag = (code: string) => {
        const flags = languages.find((lang) => lang.code === code)?.flags;
        if (flags) {
            return flags[Math.floor(Math.random() * flags.length)];
        }
        return "";
    };

    return (
        <div>
            {languages.map((lang) => {
                if (lang.code === currentLang) {
                    return (
                        <span key={lang.code} className={styles.active}>
              {getFlag(lang.code)} {lang.code}
            </span>
                    );
                } else {
                    return (
                        <Link key={lang.code} href={`https://${lang.domain}${location.pathname}`} passHref>
                            <a title={titles[lang.code]} className={styles.langButton}>
                                {getFlag(lang.code)} {lang.code}
                            </a>
                        </Link>
                    );
                }
            })}
        </div>
    );
};

export default LanguageSwitcher;
