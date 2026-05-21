"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";

const defaultSettings = {
  company_name: "",
  company_tagline: "",
  company_description: "",
  about_title: "",
  about_subtitle: "",
  about_story: "",
  about_story_2: "",
  contact_title: "",
  contact_subtitle: "",
  contact_address: "",
  contact_phone: "",
  contact_email: "",
  contact_hours: "",
  footer_about: "",
};

type Settings = typeof defaultSettings;

const sections = [
  {
    key: "site",
    label: "Site Information",
    fields: [
      { key: "company_name", label: "Company Name", type: "text" },
      { key: "company_tagline", label: "Tagline", type: "text" },
      { key: "company_description", label: "Description", type: "textarea" },
      { key: "footer_about", label: "Footer About Text", type: "textarea" },
    ],
  },
  {
    key: "about",
    label: "About Section",
    fields: [
      { key: "about_title", label: "Title", type: "text" },
      { key: "about_subtitle", label: "Subtitle", type: "text" },
      { key: "about_story", label: "Story Paragraph 1", type: "textarea" },
      { key: "about_story_2", label: "Story Paragraph 2", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Contact Section",
    fields: [
      { key: "contact_title", label: "Title", type: "text" },
      { key: "contact_subtitle", label: "Subtitle", type: "text" },
      { key: "contact_address", label: "Address", type: "text" },
      { key: "contact_phone", label: "Phone", type: "text" },
      { key: "contact_email", label: "Email", type: "email" },
      { key: "contact_hours", label: "Business Hours", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .finally(() => setLoading(false));
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
        <h1 className="text-2xl font-bold text-primary mb-8">Site Settings</h1>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {sections.map((section) => (
          <div key={section.key} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-6">{section.label}</h2>
            <div className="space-y-5">
              {section.fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  value={settings[field.key as keyof Settings]}
                  onChange={(v) => setSettings({ ...settings, [field.key]: v })}
                  type={field.type === "textarea" ? "textarea" : "text"}
                />
              ))}
            </div>
          </div>
        ))}

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
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
