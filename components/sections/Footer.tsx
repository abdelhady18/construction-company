"use client";

import { useTranslations, useLocale } from "next-intl";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

const footerLinks = ["home", "services", "projects", "about", "contact"] as const;

export default function Footer() {
  const s = useSettings();
  const t = useTranslations("footer");
  const lt = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-primary text-white border-t border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="min-w-0">
            <h3 className="font-serif text-xl tracking-wide text-accent">
              {locale === "ar" && s.company_name_ar ? s.company_name_ar : s.company_name || "Abu Suhaib Construction"}
            </h3>
            {(locale === "ar" ? s.footer_about_ar : s.footer_about) && (
              <p className="text-white/40 text-sm mt-2 max-w-xs">
                {locale === "ar" && s.footer_about_ar ? s.footer_about_ar : s.footer_about}
              </p>
            )}
          </div>
          <div className="flex items-center gap-8 min-w-0">
            {footerLinks.map((href) => (
              <a
                key={href}
                href={`#${href}`}
                className="text-white/40 hover:text-accent text-sm transition-colors"
              >
                {lt(href)}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-accent/10">
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <a href={`tel:${s.contact_phone}`} className="hover:text-accent transition-colors">
              {s.contact_phone}
            </a>
            <span className="w-px h-3 bg-accent/20" />
            <a href={`mailto:${s.contact_email}`} className="hover:text-accent transition-colors">
              {s.contact_email}
            </a>
          </div>
          <p className="text-white/20 text-xs">
            {t("copyright", { year: new Date().getFullYear(), company: locale === "ar" && s.company_name_ar ? s.company_name_ar : s.company_name || "Abu Suhaib Construction" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
