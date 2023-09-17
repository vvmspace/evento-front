import * as en from "../../public/locales/en/common.json";
import * as es from "../../public/locales/es/common.json";
import * as fr from "../../public/locales/fr/common.json";

const LANGUAGES: Record<string, Record<string, string>> = {
  en,
  es,
  fr,
};

export const t = (
  key: string,
  lang: string = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es",
) => {
  return LANGUAGES[lang][key] ?? key;
};
