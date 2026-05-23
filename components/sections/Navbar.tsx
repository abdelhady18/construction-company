"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import ScrollProgress from "@/components/ui/ScrollProgress";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import { useSettings } from "@/lib/SettingsContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const s = useSettings();
  const t = useTranslations("nav");
  const links = ["home", "services", "projects", "about", "contact"] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition duration-500 ${
          scrolled
            ? "bg-glass backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              href="#home"
              className={`font-serif text-xl tracking-wide transition-colors ${
                scrolled ? "text-heading" : "text-white"
              }`}
            >
              {s.company_name || "BuildCo"}
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {links.map((href) => (
                <a
                  key={href}
                  href={`#${href}`}
                  className={`text-sm font-medium tracking-wide transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full touch-manipulation ${
                    scrolled
                      ? "text-muted hover:text-foreground"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {t(href)}
                </a>
              ))}
              <LocaleSwitcher />
              <Button variant="outline" href="#contact">
                {t("cta")}
              </Button>
            </div>

            <button
              className={`md:hidden p-2 transition-colors ${
                scrolled ? "text-foreground" : "text-white/80"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t("toggleMenu")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
              {links.map((href) => (
                <a
                  key={href}
                  href={`#${href}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-muted hover:text-foreground rounded-lg transition-colors"
                >
                  {t(href)}
                </a>
              ))}
              <div className="px-4 pt-2 flex items-center gap-4">
                <LocaleSwitcher />
                <Button variant="outline" href="#contact" className="flex-1">
                  {t("cta")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
