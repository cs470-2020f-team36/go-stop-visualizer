import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { capitalize } from "./utils/string";
import { cardNameEn, cardNameKo, getMonthName } from "./utils/card";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      format: function (value, format, lng) {
        if (format === "uppercase") return value.toUpperCase();
        if (format === "capitalize") return capitalize(value);
        if (format === "card")
          return lng === "ko" ? cardNameKo(value) : cardNameEn(value);
        if (format === "month")
          return lng === "ko" ? `${parseInt(value)}월` : getMonthName(parseInt(value));
        return value;
      },
      escapeValue: false,
    },
  });

export default i18n;
