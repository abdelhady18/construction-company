"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setS(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0d0d0d] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-xl tracking-wide">
              {s.company_name || "BuildCo"}
            </h3>
            {s.footer_about && (
              <p className="text-white/40 text-sm mt-2 max-w-xs">
                {s.footer_about}
              </p>
            )}
          </div>
          <div className="flex items-center gap-8">
            {["Home", "Services", "Projects", "About", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-white/40 hover:text-accent text-sm transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <a href={`tel:${s.contact_phone}`} className="hover:text-accent transition-colors">
              {s.contact_phone}
            </a>
            <span className="w-px h-3 bg-white/10" />
            <a href={`mailto:${s.contact_email}`} className="hover:text-accent transition-colors">
              {s.contact_email}
            </a>
          </div>
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} {s.company_name || "BuildCo"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
