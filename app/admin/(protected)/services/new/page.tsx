"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import IconSelect from "@/components/ui/IconSelect";

const iconOptions = [
  { value: "Building", icon: "building" as const },
  { value: "Home", icon: "home" as const },
  { value: "Road", icon: "road" as const },
  { value: "Bridge", icon: "bridge" as const },
  { value: "Renovation", icon: "renovation" as const },
  { value: "Design", icon: "design" as const },
  { value: "Consulting", icon: "consulting" as const },
  { value: "Interior", icon: "interior" as const },
  { value: "Electrical", icon: "electrical" as const },
  { value: "Plumbing", icon: "plumbing" as const },
];

export default function NewServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        titleAr: form.get("titleAr") || "",
        descriptionAr: form.get("descriptionAr") || "",
        icon: form.get("icon") || "Building",
        order: Number(form.get("order")) || 0,
      }),
    });

    if (res.ok) {
      router.push("/admin/services");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">New Service</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="flex bg-border rounded-lg p-0.5 w-fit">
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

        {lang === "en" ? (
          <>
            <Input label="Title" name="title" required placeholder="e.g. Residential Construction" />
            <Input label="Description" name="description" type="textarea" required placeholder="Describe this service..." />
          </>
        ) : (
          <>
            <Input label="Title (Arabic)" name="titleAr" placeholder="العنوان بالعربية" />
            <Input label="Description (Arabic)" name="descriptionAr" type="textarea" placeholder="الوصف بالعربية" />
          </>
        )}

        <IconSelect label="Icon" name="icon" options={iconOptions} />
        <Input label="Order" name="order" type="number" placeholder="0" defaultValue="0" />
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creating…" : "Create Service"}
          </Button>
          <Button variant="ghost" href="/admin/services">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}