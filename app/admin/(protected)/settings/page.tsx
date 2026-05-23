"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import EmailInput from "@/components/ui/EmailInput";
import BusinessHoursPicker from "@/components/ui/BusinessHoursPicker";
import StatsPicker from "@/components/ui/StatsPicker";
import Skeleton from "@/components/ui/Skeleton";

const defaultSettings = {
  company_name: "",
  company_name_ar: "",
  company_tagline: "",
  company_tagline_ar: "",
  company_description: "",
  company_description_ar: "",
  about_title: "",
  about_title_ar: "",
  about_subtitle: "",
  about_subtitle_ar: "",
  about_story: "",
  about_story_ar: "",
  about_story_2: "",
  about_story_2_ar: "",
  contact_title: "",
  contact_title_ar: "",
  contact_subtitle: "",
  contact_subtitle_ar: "",
  contact_address: "",
  contact_address_ar: "",
  contact_phone: "",
  contact_email: "",
  contact_hours: JSON.stringify([
    { day: "Monday", open: "08:00", close: "18:00", closed: false },
    { day: "Tuesday", open: "08:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "08:00", close: "18:00", closed: false },
    { day: "Thursday", open: "08:00", close: "18:00", closed: false },
    { day: "Friday", open: "08:00", close: "18:00", closed: false },
    { day: "Saturday", open: "09:00", close: "13:00", closed: false },
    { day: "Sunday", open: "09:00", close: "13:00", closed: true },
  ]),
  about_stats: JSON.stringify([
    { value: "20+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "15+", label: "Expert Team" },
    { value: "100%", label: "Client Satisfaction" },
  ]),
  about_stats_ar: JSON.stringify([
    { value: "20+", label: "سنة خبرة" },
    { value: "50+", label: "مشروع مكتمل" },
    { value: "15+", label: "فريق خبير" },
    { value: "100%", label: "رضا العملاء" },
  ]),
  footer_about: "",
  footer_about_ar: "",
};

type Settings = typeof defaultSettings;

const arabicKeys = new Set([
  "company_name_ar", "company_tagline_ar", "company_description_ar",
  "about_title_ar", "about_subtitle_ar", "about_story_ar", "about_story_2_ar",
  "contact_title_ar", "contact_subtitle_ar", "contact_address_ar",
  "about_stats_ar", "footer_about_ar",
]);

interface FieldDef {
  key: string;
  label: string;
  type: string;
  appears: string;
  hasArabic: boolean;
}

const sections: { key: string; label: string; fields: FieldDef[] }[] = [
  {
    key: "site",
    label: "Site Information",
    fields: [
      { key: "company_name", label: "Company Name", type: "text", appears: "Header, Footer, Copyright", hasArabic: true },
      { key: "company_tagline", label: "Tagline", type: "text", appears: "Hero banner", hasArabic: true },
      { key: "company_description", label: "Description", type: "textarea", appears: "Hero banner subtitle", hasArabic: true },
      { key: "footer_about", label: "Footer About Text", type: "textarea", appears: "Footer sidebar", hasArabic: true },
    ],
  },
  {
    key: "about",
    label: "About Section",
    fields: [
      { key: "about_title", label: "Title", type: "text", appears: "About section heading", hasArabic: true },
      { key: "about_subtitle", label: "Subtitle", type: "text", appears: "About section under heading", hasArabic: true },
      { key: "about_story", label: "Story Paragraph 1", type: "textarea", appears: "About → Our Story", hasArabic: true },
      { key: "about_story_2", label: "Story Paragraph 2", type: "textarea", appears: "About → Our Story", hasArabic: true },
      { key: "about_stats", label: "Stats", type: "text", appears: "About section stats row", hasArabic: true },
    ],
  },
  {
    key: "contact",
    label: "Contact Section",
    fields: [
      { key: "contact_title", label: "Title", type: "text", appears: "Contact section heading", hasArabic: true },
      { key: "contact_subtitle", label: "Subtitle", type: "text", appears: "Contact section under heading", hasArabic: true },
      { key: "contact_address", label: "Address", type: "text", appears: "Contact section + Footer", hasArabic: true },
      { key: "contact_phone", label: "Phone", type: "text", appears: "Contact section + Footer", hasArabic: false },
      { key: "contact_email", label: "Email", type: "email", appears: "Contact section + Footer", hasArabic: false },
      { key: "contact_hours", label: "Business Hours", type: "text", appears: "Contact section only", hasArabic: false },
    ],
  },
];

function langKey(k: string, lang: "en" | "ar"): string {
  if (lang === "en") return k;
  switch (k) {
    case "company_name": return "company_name_ar";
    case "company_tagline": return "company_tagline_ar";
    case "company_description": return "company_description_ar";
    case "about_title": return "about_title_ar";
    case "about_subtitle": return "about_subtitle_ar";
    case "about_story": return "about_story_ar";
    case "about_story_2": return "about_story_2_ar";
    case "contact_title": return "contact_title_ar";
    case "contact_subtitle": return "contact_subtitle_ar";
    case "contact_address": return "contact_address_ar";
    case "about_stats": return "about_stats_ar";
    case "footer_about": return "footer_about_ar";
    default: return k;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-heading mb-8">Site Settings</h1>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {sections.map((section) => {
          const hasArabicFields = section.fields.some((f) => f.hasArabic);
          return (
            <div key={section.key} className="rounded-xl bg-surface p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-heading">{section.label}</h2>
                {hasArabicFields && (
                  <div className="flex bg-border rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        lang === "en" ? "bg-accent text-white" : "text-muted hover:text-foreground"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("ar")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        lang === "ar" ? "bg-accent text-white" : "text-muted hover:text-foreground"
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-5">
                {section.fields.map((field) => {
                  const key = field.hasArabic ? langKey(field.key, lang) as keyof Settings : field.key as keyof Settings;
                  return (
                    <div key={field.key + (lang === "ar" && field.hasArabic ? "_ar" : "")}>
                      {key === "contact_phone" ? (
                        <PhoneInput
                          label={field.label}
                          value={settings[key]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                          required
                        />
                      ) : key === "contact_email" ? (
                        <EmailInput
                          label={field.label}
                          value={settings[key]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                          required
                        />
                      ) : key === "contact_hours" ? (
                        <BusinessHoursPicker
                          label={field.label}
                          value={settings[key]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                        />
                      ) : key === "about_stats" || key === "about_stats_ar" ? (
                        <StatsPicker
                          label={field.label}
                          value={settings[key]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                        />
                      ) : (
                        <Input
                          label={field.label}
                          value={settings[key]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                          type={field.type === "textarea" ? "textarea" : "text"}
                          required
                        />
                      )}
                      <p className="mt-1 text-xs text-muted">
                        Appears in: <span className="font-medium">{field.appears}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {message && (
          <p
            className={`text-sm text-center ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}