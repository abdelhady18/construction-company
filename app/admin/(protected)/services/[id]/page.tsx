"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setService(data.find((s: Service) => s.id === id)));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        icon: form.get("icon"),
        order: Number(form.get("order")),
      }),
    });

    if (res.ok) {
      router.push("/admin/services");
    }
    setSubmitting(false);
  }

  if (!service) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-primary mb-8">Edit Service</h1>
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Edit Service</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input label="Title" name="title" required defaultValue={service.title} />
        <Input label="Description" name="description" type="textarea" required defaultValue={service.description} />
        <div className="flex flex-col gap-1">
          <label htmlFor="icon" className="text-sm font-medium text-gray-700">Icon</label>
          <select
            id="icon"
            name="icon"
            defaultValue={service.icon}
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
        <Input label="Order" name="order" type="number" defaultValue={String(service.order)} />
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="ghost" href="/admin/services">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
