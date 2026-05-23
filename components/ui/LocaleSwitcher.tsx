"use client";

import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("locale");

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <button
      onClick={switchLocale}
      aria-label={t("switch")}
      className="text-sm font-medium text-muted hover:text-accent transition-colors"
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}
