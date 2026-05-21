"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/services", label: "Services", icon: "🏗️" },
  { href: "/admin/projects", label: "Projects", icon: "🏗️" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          BuildCo Admin
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-colors cursor-pointer"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
