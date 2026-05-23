"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

const sidebarLinks = [
  { href: "/admin/dashboard", key: "dashboard", icon: "building" as const },
  { href: "/admin/services", key: "services", icon: "blueprint" as const },
  { href: "/admin/projects", key: "projects", icon: "hardhat" as const },
  { href: "/admin/messages", key: "messages", icon: "mail" as const },
  { href: "/admin/team", key: "team", icon: "hardhat" as const },
  { href: "/admin/settings", key: "settings", icon: "ruler" as const },
];

function switchLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
  window.location.reload();
}

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const s = useSettings();
  const locale = useLocale();

  return (
    <aside className="w-64 bg-[#0d0d0d] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin/dashboard" className="font-serif text-lg tracking-wide">
          {locale === "ar" && s.company_name_ar ? `${s.company_name_ar} إدارة` : s.company_name ? `${s.company_name} Admin` : "Abu Suhaib Construction Admin"}
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name={link.icon} size={16} />
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="flex bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => switchLocale("en")}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              locale === "en" ? "bg-accent text-white" : "text-white/50 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale("ar")}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              locale === "ar" ? "bg-accent text-white" : "text-white/50 hover:text-white"
            }`}
          >
            AR
          </button>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 w-full transition-colors cursor-pointer"
        >
          <Icon name="close" size={16} />
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
