import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSettings();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{s.company_name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {s.footer_about}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "Services", "Projects", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {s.contact_address && s.contact_address.split(",").map((line, i) => <li key={i}>{line.trim()}</li>)}
              <li>{s.contact_phone}</li>
              <li>{s.contact_email}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {s.company_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
