"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "building" as const },
  { href: "/admin/services", label: "Services", icon: "blueprint" as const },
  { href: "/admin/projects", label: "Projects", icon: "hardhat" as const },
  { href: "/admin/messages", label: "Messages", icon: "mail" as const },
  { href: "/admin/settings", label: "Settings", icon: "ruler" as const },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d0d0d] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin/dashboard" className="font-serif text-lg tracking-wide">
          BuildCo Admin
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
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
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 w-full transition-colors cursor-pointer"
        >
          <Icon name="close" size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
