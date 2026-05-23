"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        role: form.get("role"),
        nameAr: form.get("nameAr") || "",
        roleAr: form.get("roleAr") || "",
        imageUrl: imageUrl || null,
        order: Number(form.get("order")) || 0,
      }),
    });

    if (res.ok) {
      router.push("/admin/team");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">New Team Member</h1>
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
            <Input label="Name" name="name" required placeholder="e.g. John Smith" />
            <Input label="Job Title" name="role" required placeholder="e.g. CEO & Founder" />
          </>
        ) : (
          <>
            <Input label="Name (Arabic)" name="nameAr" placeholder="الاسم بالعربية" />
            <Input label="Job Title (Arabic)" name="roleAr" placeholder="المسمى الوظيفي بالعربية" />
          </>
        )}

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Photo
          </label>
          {imageUrl && (
            <div className="mb-3">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border border-border"
              />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Uploading..." : imageUrl ? "Change Photo" : "Upload Photo"}
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="ml-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"
            >
              Remove
            </button>
          )}
          <p className="mt-1 text-xs text-muted">
            Max 500 KB. If no photo, initials will be shown instead.
          </p>
        </div>

        <Input label="Order" name="order" type="number" placeholder="0" defaultValue="0" />
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Member"}
          </Button>
          <Button variant="ghost" href="/admin/team">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}