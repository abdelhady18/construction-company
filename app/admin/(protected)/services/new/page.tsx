"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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
      <h1 className="text-2xl font-bold text-primary mb-8">New Service</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input label="Title" name="title" required placeholder="e.g. Residential Construction" />
        <Input label="Description" name="description" type="textarea" required placeholder="Describe this service..." />
        <div className="flex flex-col gap-1">
          <label htmlFor="icon" className="text-sm font-medium text-gray-700">Icon</label>
          <select
            id="icon"
            name="icon"
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          >
            <option value="Building">🏗️ Building</option>
            <option value="Home">🏠 Home</option>
            <option value="Renovation">🔨 Renovation</option>
            <option value="Design">📐 Design</option>
            <option value="Consulting">📋 Consulting</option>
            <option value="Interior">🪑 Interior</option>
            <option value="Electrical">⚡ Electrical</option>
            <option value="Plumbing">🔧 Plumbing</option>
          </select>
        </div>
        <Input label="Order" name="order" type="number" placeholder="0" defaultValue="0" />
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Service"}
          </Button>
          <Button variant="ghost" href="/admin/services">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
