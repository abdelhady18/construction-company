"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewProjectPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
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
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        titleAr: form.get("titleAr") || "",
        descriptionAr: form.get("descriptionAr") || "",
        category: form.get("category"),
        featured: form.get("featured") === "on",
        images,
      }),
    });

    if (res.ok) {
      router.push("/admin/projects");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">New Project</h1>
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
            <Input label="Title" name="title" required placeholder="e.g. Modern Office Building" />
            <Input label="Description" name="description" type="textarea" required placeholder="Describe the project..." />
          </>
        ) : (
          <>
            <Input label="Title (Arabic)" name="titleAr" placeholder="العنوان بالعربية" />
            <Input label="Description (Arabic)" name="descriptionAr" type="textarea" placeholder="الوصف بالعربية" />
          </>
        )}

        <Input label="Category" name="category" placeholder="e.g. Commercial, Residential, Industrial" />
        <ImageUploader images={images} onChange={setImages} />
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input type="checkbox" name="featured" className="rounded" />
          Featured project
        </label>
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creating…" : "Create Project"}
          </Button>
          <Button variant="ghost" href="/admin/projects">Cancel</Button>
        </div>
      </form>
    </div>
  );
}