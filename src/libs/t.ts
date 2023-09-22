import * as en from "../../public/locales/en/common.json";
import * as es from "../../public/locales/es/common.json";
import * as fr from "../../public/locales/fr/common.json";
import * as am from "../../public/locales/am/common.json";

const LANGUAGES: Record<string, Record<string, string>> = {
  en,
  es,
  fr,
  am,
};

export const t = (
  key: string,
  lang: string = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es",
) => {
  return LANGUAGES[lang][key] ?? key;
};
